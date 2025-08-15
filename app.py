import os
import json
import logging
from flask import Flask, render_template, jsonify, request, redirect, url_for
from random import choice

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "extinct-animals-coloring-book-secret")

def load_animals_data():
    """Load animals data from JSON file"""
    try:
        with open('data/animals.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logging.error("animals.json file not found")
        return []
    except json.JSONDecodeError:
        logging.error("Error decoding animals.json")
        return []

@app.route('/')
def index():
    """Home page showing all animals"""
    animals = load_animals_data()
    
    # Get filter parameters
    category_filter = request.args.get('category', '')
    search_query = request.args.get('search', '')
    
    # Apply filters
    if category_filter:
        animals = [animal for animal in animals if animal['category'].lower() == category_filter.lower()]
    
    if search_query:
        animals = [animal for animal in animals if search_query.lower() in animal['name'].lower() or 
                  search_query.lower() in animal['description'].lower()]
    
    # Get unique categories for filter dropdown
    all_animals = load_animals_data()
    categories = sorted(list(set(animal['category'] for animal in all_animals)))
    
    return render_template('index.html', 
                         animals=animals, 
                         categories=categories,
                         current_category=category_filter,
                         search_query=search_query)

@app.route('/color/<animal_id>')
def color_animal(animal_id):
    """Individual coloring page for an animal"""
    animals = load_animals_data()
    animal = next((a for a in animals if a['id'] == animal_id), None)
    
    if not animal:
        return redirect(url_for('index'))
    
    return render_template('color.html', animal=animal)

@app.route('/random')
def random_animal():
    """Redirect to a random animal's coloring page"""
    animals = load_animals_data()
    if animals:
        random_animal = choice(animals)
        return redirect(url_for('color_animal', animal_id=random_animal['id']))
    return redirect(url_for('index'))

@app.route('/api/animals')
def api_animals():
    """API endpoint to get all animals data"""
    return jsonify(load_animals_data())

@app.route('/api/animal/<animal_id>')
def api_animal(animal_id):
    """API endpoint to get specific animal data"""
    animals = load_animals_data()
    animal = next((a for a in animals if a['id'] == animal_id), None)
    if animal:
        return jsonify(animal)
    return jsonify({'error': 'Animal not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
