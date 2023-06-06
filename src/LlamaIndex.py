from flask import Flask, request, jsonify
from llama_index import GPTVectorStoreIndex, Document, SimpleDirectoryReader
import os
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/query/<string:query>', methods=['GET'])
def query(query):
    response = query_engine.query(query)
    return jsonify({'response': response})

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    save_path = 'C:\git\ChatGPT\Documentation'  # Replace with your desired save directory
    
    if file:
        filename = file.filename
        file.save(os.path.join(save_path, filename))
        return 'File uploaded successfully'
    
    return 'No file uploaded'

@app.route('/delete', methods=['POST'])
def delete_file():
    mydir = 'C:\git\ChatGPT\Documentation'
    filelist = [ f for f in os.listdir(mydir) ]
    for f in filelist:
        os.remove(os.path.join(mydir, f))

if __name__ == '__main__':
    

# create a SimpleDirectoryReader object
    reader = SimpleDirectoryReader('C:\git\ChatGPT\Documentation')

# load data from files
    documents = reader.load_data()
    index = GPTVectorStoreIndex.from_documents(documents)
    # index.save_to_disk('index.json')
    # index = GPTVectorStoreIndex.load_from_disk('index.json')
    index.storage_context.persist()

    query_engine = index.as_query_engine()

    app.run(port=5000)


