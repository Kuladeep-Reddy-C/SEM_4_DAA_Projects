# app.py - Flask Backend for ATS Score Calculator

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz  # PyMuPDF for PDF processing
import re
from werkzeug.utils import secure_filename
import json
import time
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'txt'}
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Skills database - these could be loaded from a database in a real application
SKILLS_BY_POSITION = {
    "software_developer": [
        "Python", "Java", "JavaScript", "React", "Node.js", "SQL", "NoSQL", 
        "AWS", "Docker", "Kubernetes", "CI/CD", "Git", "Agile"
    ],
    "data_scientist": [
        "Python", "R", "SQL", "Machine Learning", "Deep Learning", "TensorFlow", 
        "PyTorch", "Pandas", "NumPy", "Data Visualization", "Statistics", "Jupyter"
    ],
    "product_manager": [
        "Product Strategy", "Agile", "Scrum", "User Research", "Market Analysis", 
        "Roadmapping", "A/B Testing", "KPI", "Revenue Growth", "User Experience", "Stakeholder Management"
    ],
    "ux_designer": [
        "Figma", "Adobe XD", "Sketch", "User Research", "Wireframing", "Prototyping", 
        "UI Design", "Usability Testing", "Information Architecture", "Design Systems"
    ]
}

# List of popular MNCs for tech positions
MNCS = ["Google", "Microsoft", "Amazon", "Apple", "Meta", "IBM", "Oracle", "Intel", "Netflix", "Adobe"]

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file using PyMuPDF (fitz)"""
    text = ""
    try:
        print(f"Opening PDF: {pdf_path}")
        doc = fitz.open(pdf_path)
        print(f"PDF opened successfully, pages: {doc.page_count}")
        
        for page_num in range(doc.page_count):
            try:
                page = doc[page_num]
                page_text = page.get_text()
                text += page_text
                print(f"Extracted page {page_num + 1}/{doc.page_count}, length: {len(page_text)} chars")
            except Exception as e:
                print(f"Error extracting page {page_num + 1}: {e}")
                print(traceback.format_exc())
        
        doc.close()
        print(f"Total extracted text length: {len(text)} chars")
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        print(traceback.format_exc())
        return ""

def boyer_moore_search(text, pattern, max_iterations=10000):
    """Implementation of Boyer-Moore string search algorithm with iteration limit"""
    # Convert both text and pattern to lowercase for case-insensitive matching
    text = text.lower()
    pattern = pattern.lower()
    
    n = len(text)
    m = len(pattern)
    
    if m > n:
        return -1
    
    # Preprocessing
    bad_char = {}
    for i in range(m):
        bad_char[pattern[i]] = i
    
    # Search
    s = 0
    iterations = 0
    while s <= n - m and iterations < max_iterations:
        iterations += 1
        j = m - 1
        
        while j >= 0 and pattern[j] == text[s + j]:
            j -= 1
            
        if j < 0:
            return s  # Match found
        
        # Calculate shift
        char_to_look = text[s + j]
        skip = j - bad_char.get(char_to_look, -1)
        if skip < 1:
            skip = 1
        s += skip
    
    if iterations >= max_iterations:
        print(f"Boyer-Moore search exceeded maximum iterations for pattern: {pattern}")
    
    return -1  # No match found

def find_skill_occurrences(text, skills):
    """Find all occurrences of skills in the text using Boyer-Moore algorithm"""
    matches = {}
    text_lower = text.lower()
    start_time = time.time()
    
    for index, skill in enumerate(skills):
        try:
            if index > 0 and index % 5 == 0:
                print(f"Processed {index}/{len(skills)} skills, elapsed: {time.time() - start_time:.2f}s")
            
            skill_lower = skill.lower()
            positions = []
            pos = 0
            
            while True:
                search_result = boyer_moore_search(text_lower[pos:], skill_lower)
                if search_result == -1:
                    break
                
                # Adjust position to account for the sliced text
                absolute_pos = pos + search_result
                
                # Check if the skill is a standalone word
                start_pos = absolute_pos
                end_pos = absolute_pos + len(skill_lower)
                is_standalone = True
                
                # Check if the character before the match is a word character
                if start_pos > 0 and text_lower[start_pos-1].isalnum():
                    is_standalone = False
                    
                # Check if the character after the match is a word character
                if end_pos < len(text_lower) and text_lower[end_pos].isalnum():
                    is_standalone = False
                    
                if is_standalone:
                    positions.append(absolute_pos)
                    
                pos = absolute_pos + len(skill_lower)  # Move past this occurrence
                if pos >= len(text_lower):
                    break
                    
            if positions:
                matches[skill] = positions
        except Exception as e:
            print(f"Error processing skill '{skill}': {e}")
            print(traceback.format_exc())
            
    print(f"Skill occurrence search completed in {time.time() - start_time:.2f}s")
    print(f"Found matches for {len(matches)} skills out of {len(skills)}")
    return matches

def analyze_resume(text, job_position):
    """Analyze resume text against required skills for a job position"""
    print(f"Starting resume analysis for position: {job_position}")
    print(f"Text length: {len(text)} characters")
    analysis_start_time = time.time()
    
    try:
        if job_position not in SKILLS_BY_POSITION:
            print(f"Position {job_position} not found, using default")
            job_position = "software_developer"  # Default
            
        required_skills = SKILLS_BY_POSITION[job_position]
        print(f"Searching for {len(required_skills)} required skills")
        
        matched_skills = []
        unmatched_skills = []
        
        # Find skill occurrences
        print("Finding skill occurrences...")
        skill_occurrences = find_skill_occurrences(text, required_skills)
        print(f"Found occurrences for {len(skill_occurrences)} skills")
        
        for skill in required_skills:
            if skill in skill_occurrences:
                matched_skills.append(skill)
            else:
                unmatched_skills.append(skill)
        
        # Calculate ATS score
        total_skills = len(required_skills)
        matched_count = len(matched_skills)
        ats_score = (matched_count / total_skills) * 100 if total_skills > 0 else 0
        print(f"ATS Score calculated: {ats_score:.2f}%")
        
        # Generate suggestions for improvement
        print("Generating suggestions...")
        suggestions = []
        if matched_count < total_skills:
            suggestions.append(f"Consider adding the following skills to improve your resume for this position: {', '.join(unmatched_skills)}")
        if matched_count < (total_skills * 0.6):
            suggestions.append("Your resume may need significant improvements to match this job position.")
        
        # Check for MNC mentions
        print("Checking for MNC mentions...")
        mnc_mentions = []
        for company in MNCS:
            if company.lower() in text.lower():
                mnc_mentions.append(company)
        
        # Check keyword density
        print("Calculating keyword density...")
        keyword_density = {}
        start_time = time.time()
        words = re.findall(r'\b\w+\b', text.lower())
        total_words = len(words)
        print(f"Found {total_words} words in {time.time() - start_time:.2f}s")
        
        for skill in matched_skills:
            try:
                skill_lower = skill.lower()
                count = 0
                for word in words:
                    if skill_lower == word:
                        count += 1
                if total_words > 0:
                    keyword_density[skill] = (count / total_words) * 100
            except Exception as e:
                print(f"Error calculating density for skill '{skill}': {e}")
        
        # Generate highlighted text
        print("Generating highlighted text...")
        try:
            # Limit highlighted text size to prevent memory issues
            MAX_TEXT_LENGTH = 100000  # Limit to 100K characters for highlighting
            if len(text) > MAX_TEXT_LENGTH:
                truncated_text = text[:MAX_TEXT_LENGTH] + "... (text truncated for display)"
                print(f"Text truncated from {len(text)} to {len(truncated_text)} characters for highlighting")
                text_to_highlight = truncated_text
            else:
                text_to_highlight = text
                
            highlighted_text = text_to_highlight
            for skill in matched_skills:
                pattern = re.compile(re.escape(skill), re.IGNORECASE)
                highlighted_text = pattern.sub(f"<mark>{skill}</mark>", highlighted_text)
        except Exception as e:
            print(f"Error highlighting text: {e}")
            print(traceback.format_exc())
            highlighted_text = text_to_highlight  # Fallback to original text
        
        result = {
            "ats_score": round(ats_score, 2),
            "matched_skills": matched_skills,
            "unmatched_skills": unmatched_skills,
            "total_skills": total_skills,
            "matched_count": matched_count,
            "suggestions": suggestions,
            "mnc_mentions": mnc_mentions,
            "keyword_density": keyword_density,
            "highlighted_text": highlighted_text,
        }
        
        print(f"Analysis complete in {time.time() - analysis_start_time:.2f}s, returning results")
        return result
        
    except Exception as e:
        print(f"Error in analyze_resume: {e}")
        print(traceback.format_exc())
        # Return a basic error response that will still be valid JSON
        return {
            "error": f"Analysis failed: {str(e)}",
            "ats_score": 0,
            "matched_skills": [],
            "unmatched_skills": SKILLS_BY_POSITION.get(job_position, SKILLS_BY_POSITION["software_developer"]),
            "total_skills": len(SKILLS_BY_POSITION.get(job_position, SKILLS_BY_POSITION["software_developer"])),
            "matched_count": 0,
            "suggestions": ["Analysis failed due to an error. Please try again or contact support."],
            "mnc_mentions": [],
            "keyword_density": {},
            "highlighted_text": text[:5000] + "... (truncated due to error)",  # Limit text size in error case
        }

@app.route('/api/upload', methods=['POST'])
def upload_file():
    print("Received upload request")
    start_time = time.time()
    
    try:
        if 'file' not in request.files:
            print("No file part in request")
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        job_position = request.form.get('job_position', 'software_developer')
        print(f"Job position: {job_position}")
        
        if file.filename == '':
            print("No file selected")
            return jsonify({"error": "No file selected"}), 400
        
        print(f"File received: {file.filename}")
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            print(f"Saving file to {filepath}")
            file.save(filepath)
            
            # Extract text from file
            print(f"Extracting text from {filename}")
            if filename.lower().endswith('.pdf'):
                text = extract_text_from_pdf(filepath)
            else:  # .txt file
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    text = f.read()
            
            # Log the extracted text length
            print(f"Extracted content length: {len(text)} characters")
            print(f"First 200 chars: {text[:200]}")
            
            # Analyze the resume
            if not text:
                print("No text extracted from file")
                return jsonify({"error": "Could not extract text from the file"}), 400
                
            print("Starting resume analysis")
            result = analyze_resume(text, job_position)
            
            # Clean up - remove uploaded file after processing
            try:
                os.remove(filepath)
                print(f"Removed temporary file: {filepath}")
            except Exception as e:
                print(f"Failed to remove temporary file: {e}")
            
            print(f"Total processing time: {time.time() - start_time:.2f}s")
            return jsonify(result)
        
        print(f"Invalid file format: {file.filename}")
        return jsonify({"error": "Invalid file format. Only PDF and TXT files are allowed"}), 400
    
    except Exception as e:
        print(f"Unexpected error in upload_file: {e}")
        print(traceback.format_exc())
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/job-positions', methods=['GET'])
def get_job_positions():
    try:
        positions = [
            {"id": "software_developer", "name": "Software Developer"},
            {"id": "data_scientist", "name": "Data Scientist"},
            {"id": "product_manager", "name": "Product Manager"},
            {"id": "ux_designer", "name": "UX Designer"}
        ]
        return jsonify(positions)
    except Exception as e:
        print(f"Error in get_job_positions: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/mncs', methods=['GET'])
def get_mncs():
    try:
        return jsonify(MNCS)
    except Exception as e:
        print(f"Error in get_mncs: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple endpoint to check if the server is running"""
    return jsonify({
        "status": "ok",
        "message": "ATS Score Calculator API is running",
        "version": "1.0.0"
    })

if __name__ == '__main__':
    print("Starting ATS Score Calculator API...")
    for position, skills in SKILLS_BY_POSITION.items():
        print(f"Position: {position}, Skills: {len(skills)}")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)