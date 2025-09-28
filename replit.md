# Video Editor Application

## Overview

This is a professional browser-based video editing application built with React, TypeScript, and modern web technologies. The application provides a comprehensive video editing experience with timeline-based editing, text overlays, sticker integration, and stock video library access. It features a dark theme interface optimized for video editing workflows and supports drag-and-drop file uploads, real-time preview, and export capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Build Tool**: Vite for fast development and optimized production builds
- **Component Library**: Radix UI primitives with custom shadcn/ui components for consistent design system
- **Styling**: Tailwind CSS with custom video editor theme featuring dark color scheme and purple/blue accent colors
- **State Management**: React hooks and context for local state, TanStack Query for server state management
- **Routing**: React Router for client-side navigation with catch-all 404 handling

### UI Component System
- **Design Philosophy**: Dark theme optimized for video editing with vibrant purple primary colors and blue accents
- **Component Structure**: Modular component architecture with reusable UI primitives
- **Layout**: Three-panel layout consisting of sidebar (tools), main preview area, and timeline
- **Responsive Design**: Mobile-first approach with breakpoint-based responsive behavior

### Video Processing Architecture
- **File Handling**: Browser-based video processing using HTML5 Video API and Canvas for rendering
- **Timeline System**: Custom timeline component with scene management and overlay positioning
- **Preview System**: Real-time video preview with overlay rendering using canvas compositing
- **Export System**: Client-side video processing and export capabilities

### Core Features
- **File Upload**: Drag-and-drop and file picker with video format validation and size limits
- **Video Timeline**: Multi-track timeline with scene splitting and overlay management
- **Text Overlays**: Dynamic text overlay system with positioning, styling, and timing controls
- **Sticker/Symbol System**: Emoji and symbol overlay system with rotation and opacity controls
- **Stock Video Library**: Integration with external stock video services
- **Playback Controls**: Professional video controls with speed adjustment and frame-accurate seeking

### Data Models
- **VideoData**: Core video file information including duration, current time, and playback state
- **TextOverlay**: Text overlay configuration with position, styling, and timing properties
- **StickerOverlay**: Sticker/emoji overlay with transformation and animation properties
- **Scene**: Timeline scene segments with start/end times and visual organization

## External Dependencies

### UI and Styling
- **@radix-ui/***: Comprehensive set of headless UI primitives for accessible component development
- **tailwindcss**: Utility-first CSS framework for rapid styling and theming
- **lucide-react**: Icon library providing consistent iconography throughout the application
- **class-variance-authority**: Type-safe variant management for component styling
- **next-themes**: Theme management system for dark/light mode support

### Video and Media Processing
- **HTML5 Video API**: Native browser video playback and manipulation
- **Canvas API**: Real-time rendering and compositing of video overlays and effects

### Development and Build Tools
- **Vite**: Modern build tool with fast HMR and optimized production builds
- **TypeScript**: Static type checking and enhanced developer experience
- **ESLint**: Code quality and consistency enforcement
- **React Hook Form**: Form state management with validation capabilities

### State Management and Data Fetching
- **@tanstack/react-query**: Server state management and caching for external API calls
- **React Context**: Local application state management for video editor state

### External Services Integration
- **Stock Video APIs**: Integration capabilities for external stock video libraries (Pixabay, Pexels)
- **File System Access**: Browser-based file handling for video import and export operations