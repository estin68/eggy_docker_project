from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/submit")
async def submit_email(email: str = Form(...)):
    os.makedirs('/app/data', exist_ok=True)
    emails = []
    if os.path.exists('/app/data/emails.txt'):
        with open('/app/data/emails.txt', 'r') as f:
            emails = f.readlines()
        emails = [e.strip() for e in emails]
    
    if email in emails:
        return JSONResponse(content={"message": "Email already exists!"}, status_code=400)
    
    with open('/app/data/emails.txt', 'a') as f:
        f.write(email + '\n')
    return JSONResponse(content={"message": "Email saved!"}, status_code=200)

@app.get("/emails")
async def get_emails():
    emails = []
    if os.path.exists('/app/data/emails.txt'):
        with open('/app/data/emails.txt', 'r') as f:
            emails = f.readlines()
    emails = [email.strip() for email in emails]
    return JSONResponse(content={"emails": emails}, status_code=200)

@app.delete("/delete-single")
async def delete_email(email: str = Form(...)):
    file_path = '/app/data/emails.txt'
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Email file not found")
    
    # Read the existing emails
    with open(file_path, 'r') as f:
        emails = f.readlines()
    
    # Remove the specified email
    emails = [e.strip() for e in emails if e.strip() != email]
    
    if len(emails) == len([e.strip() for e in open(file_path, 'r').readlines()]):
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Write the updated list back to the file
    with open(file_path, 'w') as f:
        f.write('\n'.join(emails) + '\n')
    
    return JSONResponse(content={"message": "Email deleted successfully!"}, status_code=200)

@app.delete("/delete")
async def delete_emails():
    file_path = '/app/data/emails.txt'
    if os.path.exists(file_path):
        open(file_path, 'w').close()  # Clear the file content
        return JSONResponse(content={"message": "All emails cleared!"}, status_code=200)
    return JSONResponse(content={"message": "No emails to delete!"}, status_code=404)
