# Online Cafe
Project Overview

This project is an online café website built with Django, allowing users to browse and filter categories of food and drinks, leave ratings and comments on products, and manage their orders. It also includes an admin panel for managing products and categories. The project follows best practices for Django development, including the use of class-based views and APIs for all views.
Features

    User registration and login functionality
    Browsing and filtering products by category (food and drinks)
    User reviews and ratings for products
    Order management system for users
    Product and category management through the Django admin panel
    Class-based views (CBVs) and API integration
    Responsive design using TailwindCSS
    Group collaboration support for a team-based approach

## Project Structure

This project is divided into several Django apps to modularize features:

    Account App: Handles user registration, login, and logout functionality.
    Store App: Manages products, categories, and user reviews.
    Order App: Handles customer orders, including creating and managing orders.

## Technologies Used

    Python (Django Framework)
    JavaScript (Pure JS, without jQuery)
    HTML/CSS (using TailwindCSS for styling)
    Django REST Framework for APIs
    SQLite for database (default for Django, can be replaced with PostgreSQL/MySQL)
    Docker (optional, for containerization)
    
## Usage

1. User Registration & Login

    Users can create an account and log in to browse the café menu and place orders.

2. Browse Products

    Products are divided into categories like food and drinks. Users can filter products by category and view detailed descriptions, ratings, and comments.

3. Rating & Reviews

    Logged-in users can leave comments and rate products, providing feedback to the café.

4. Order Management

    Users can place orders, view their order history, and manage their current orders.

5. Admin Panel

    Admins can log in to the Django admin panel to manage products, categories, and orders.

## API Endpoints

The project also includes API endpoints for the main features:

    /api/products/ - List of all products
    /api/categories/ - List of product categories
    /api/orders/ - Create and manage orders
    /api/reviews/ - Submit product reviews and ratings
