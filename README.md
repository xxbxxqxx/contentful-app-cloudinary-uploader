This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

## Introduction

This is Cloudinary Uploader Widget for Contentful App. 
Zou can upload assets to Cloudinary and use them for your contents in Contentful.

## How to use

### In Cloudinary Organization
1. Go to Organision's App config page.
2. Create a new App
3. Check `App configuration screen` and `Sidebar` in Locations
4. Install it to your space

### In your local
1. Clone the repository
2. `cd ~/app_repository`
3. `npm install`
4. `npm run build`
5. `npm run upload`
    - Or you can upload `dist` to a hosting service like Cloudflare Pages.

### In your Contentful Space
1. Go to Content model definition
2. Go to Sidebar menu
3. Add your Cloudinary Uploader app into sidebar

Now all set!
You can start using Cloudinary Uploader Widget in Contentful.

## Note
- Cloudinary account and its cloud name and upload preset required
