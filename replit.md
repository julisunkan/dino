# Overview

The Extinct Animals Coloring Book is an educational web application built with Python Flask that allows users to discover and digitally color 20 extinct animals. The app combines learning with interactive entertainment, featuring professional SVG line drawings that users can color using click-to-fill functionality. Each animal includes educational facts about their extinction and habitat, making it both an artistic and educational experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a traditional server-side rendered architecture with Flask and Jinja2 templates. The frontend consists of:

- **Template Structure**: Base template (`base.html`) with child templates for different pages (index, coloring interface)
- **Responsive Design**: Bootstrap-based UI with dark theme support and mobile-responsive layouts
- **Interactive Coloring**: JavaScript-based coloring system using SVG manipulation for click-to-fill functionality
- **Client-side Storage**: Local storage for tracking user progress and colored animals
- **Dynamic Filtering**: Real-time search and category filtering on the homepage

## Backend Architecture
Simple Flask application with a modular structure:

- **Route Handlers**: Separate routes for homepage (`/`), individual coloring pages (`/color/<animal_id>`), and random animal selection
- **Data Management**: JSON-based data storage for animal metadata including descriptions, locations, and extinction information
- **Static File Serving**: SVG assets served from static directory with proper organization
- **Session Management**: Basic Flask session handling for user preferences

## Data Storage Solutions
**File-based Storage**: 
- Animal metadata stored in `data/animals.json` containing 20 extinct animals with structured data (id, name, category, description, location, extinction details)
- SVG image assets organized in `/static/images/animals/` directory
- No database requirements - all data is statically served

**Client-side Storage**:
- Local storage used for tracking user coloring progress
- Color history and undo/redo functionality stored in browser memory

## Design Patterns
- **MVC Pattern**: Clear separation between data (JSON), views (Jinja2 templates), and controllers (Flask routes)
- **Component-based Frontend**: Modular JavaScript class (`ColoringApp`) for handling interactive coloring functionality
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced features require JS

# External Dependencies

## Frontend Libraries
- **Bootstrap CSS**: UI framework with dark theme support served via CDN
- **Font Awesome**: Icon library for consistent iconography
- **Vanilla JavaScript**: No heavy frontend frameworks, keeping the application lightweight

## Backend Dependencies
- **Flask**: Web framework for Python providing routing, templating, and request handling
- **Python Standard Library**: JSON handling, file operations, and logging functionality

## Development Tools
- **Python 3.x**: Runtime environment
- **Static Asset Management**: Flask's built-in static file serving for CSS, JavaScript, and SVG assets

## Recent Changes
**August 15, 2025**: Updated animal SVGs for improved realism and anatomical accuracy:
- Enhanced Woolly Mammoth with realistic dome head, curved tusks, dense fur texture, and proper proportions
- Improved Saber-toothed Cat with muscular build, detailed claws, and characteristic long canine teeth
- Refined T-Rex with massive jaws, accurate teeth positioning, powerful legs, and dorsal spines
- Updated Dodo with distinctive hooked beak, vestigial wings, and plump body proportions
- Enhanced Barbary Lion with magnificent mane details and powerful muscular structure
- Improved Tasmanian Tiger with dog-like anatomy, elongated snout, and distinctive stripe patterns
- Refined Passenger Pigeon with streamlined body and long pointed wings for flight
- Enhanced Cave Bear with massive robust build and powerful shoulder structure

## Future Considerations
The architecture is designed to easily accommodate:
- Database integration (mentioned potential for Drizzle/Postgres addition)
- Map integration using Leaflet.js for habitat visualization
- Export functionality for saving colored images as PNG
- Timeline view for extinction periods