# Secure Personal Gemini Journal

A secure AI-powered personal journal built for the Hack2Skill Gen AI Academy APAC Ideathon.

## Overview

Secure Personal Gemini Journal allows authenticated users to write private journal entries and receive AI-powered reflections using Google Gemini.

The application combines:

- React for the frontend
- Firebase Authentication for secure user authentication
- Cloud Firestore for storing journal entries
- Google Gemini API for AI-powered reflections
- Node.js and Express for the backend
- Google Cloud Run for cloud deployment

## Features

- User sign-up and login
- Secure authenticated journal entries
- Per-user Firestore data access
- AI-powered journal reflections using Gemini
- Journal history
- Secure Firestore security rules
- Cloud-ready Node.js backend
- Cloud Run deployment architecture

## Architecture

```text
User
  |
  v
React Frontend
  |
  +----> Firebase Authentication
  |
  +----> Cloud Firestore
  |
  v
Node.js / Express Backend
  |
  v
Google Gemini API
  |
  v
AI Reflection