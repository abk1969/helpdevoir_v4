import boto3
import json
from PIL import Image
import io
import base64
from typing import List, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class M3DOCRAG:
    def __init__(self, use_flash_attention: bool = False):
        """Initialize AWS Bedrock client and configurations."""
        self.bedrock = boto3.client(
            service_name='bedrock-runtime',
            region_name='us-east-1'
        )
        self.model_id = "anthropic.claude-3-sonnet-20240229-v1:0"
        self.max_tokens = 4096
        self.temperature = 0.1
        self.pages = []

    def add_document(self, pdf_path: str, doc_id: str):
        """Add a PDF document and convert pages to images."""
        try:
            from pdf2image import convert_from_path
            images = convert_from_path(pdf_path, dpi=144)
            
            for idx, image in enumerate(images):
                # Convert PIL Image to base64
                buffered = io.BytesIO()
                image.save(buffered, format="PNG")
                img_str = base64.b64encode(buffered.getvalue()).decode()
                
                self.pages.append({
                    'doc_id': doc_id,
                    'page_num': idx,
                    'image': img_str
                })
                
            logger.info(f"Successfully added document {doc_id} with {len(images)} pages")
            return True
            
        except Exception as e:
            logger.error(f"Error adding document: {str(e)}")
            return False

    def build_index(self):
        """Prepare the document index."""
        logger.info(f"Index built with {len(self.pages)} pages")
        return True

    def process_query(self, query: str) -> str:
        """Process a query using AWS Bedrock."""
        try:
            # Prepare the prompt with images
            messages = []
            
            # System message
            messages.append({
                "role": "system",
                "content": [{"type": "text", "text": """You are a homework assistant that helps students understand their assignments.
                Follow these rules strictly:
                1. Analyze the provided document/image carefully
                2. Provide clear, educational explanations
                3. Guide students to understand concepts rather than giving direct answers
                4. Use examples to illustrate points
                5. Encourage critical thinking
                6. If you can't help or the content is unclear, say so directly"""}]
            })
            
            # Add images and query
            content = []
            for page in self.pages:
                content.append({
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": page['image']
                    }
                })
            
            content.append({
                "type": "text",
                "text": f"Please help me understand this homework: {query}"
            })
            
            messages.append({
                "role": "user",
                "content": content
            })

            # Call AWS Bedrock
            response = self.bedrock.invoke_model(
                modelId=self.model_id,
                body=json.dumps({
                    "messages": messages,
                    "max_tokens": self.max_tokens,
                    "temperature": self.temperature,
                    "anthropic_version": "bedrock-2023-05-31"
                })
            )
            
            response_body = json.loads(response['body'].read())
            answer = response_body['content'][0]['text']
            
            logger.info("Successfully processed query")
            return answer
            
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            return f"Error processing your request: {str(e)}"