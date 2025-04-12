from flask import Flask, request, jsonify
from flask_cors import CORS
from m3docrag import M3DOCRAG
import tempfile
import os
import logging
from PIL import Image

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize M3DOCRAG
rag = M3DOCRAG(use_flash_attention=False)

@app.route('/api/homework/correct', methods=['POST'])
def correct_homework():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        question = request.form.get('question', '')
        homework_id = request.form.get('homeworkId', '')
        
        if not file.filename:
            return jsonify({'error': 'No file selected'}), 400
            
        # Vérifier le type de fichier
        is_image = file.content_type.startswith('image/')
        is_pdf = file.content_type == 'application/pdf'
        
        if not (is_image or is_pdf):
            return jsonify({'error': 'Invalid file type. Only images and PDF files are accepted'}), 400
            
        # Sauvegarder le fichier temporairement
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            try:
                file.save(tmp.name)
                logger.info(f'Processing homework {homework_id}')
                
                # Si c'est une image, la convertir en PDF
                if is_image:
                    img = Image.open(tmp.name)
                    pdf_path = tmp.name + '.pdf'
                    img.save(pdf_path, 'PDF', resolution=100.0)
                    rag.add_document(pdf_path, homework_id)
                    os.unlink(pdf_path)
                else:
                    rag.add_document(tmp.name, homework_id)
                
                rag.build_index()
                answer = rag.process_query(question)
                
                return jsonify({
                    'correction': answer,
                    'status': 'success'
                })
            except Exception as e:
                logger.error(f'Error processing file: {str(e)}')
                return jsonify({
                    'error': 'Error processing file',
                    'details': str(e)
                }), 500
            finally:
                try:
                    os.unlink(tmp.name)
                except Exception as e:
                    logger.error(f'Error deleting temporary file: {str(e)}')
                
    except Exception as e:
        logger.error(f'Error in correction endpoint: {str(e)}')
        return jsonify({
            'error': 'Une erreur est survenue lors de la correction',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)