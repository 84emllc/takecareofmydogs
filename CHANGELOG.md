# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.1] - 2025-12-31

### Fixed
- Race condition in midnight checkbox reset where old items could persist into the new day
- Added `visibilitychange` listener for PWA foreground detection to ensure immediate date check

## [1.4.0] - 2025-12-30

### Added
- Custom PWA install banner with "Install App" button
- iOS fallback with manual install instructions
- Session-based dismiss functionality for install banner
- Full viewport width banner styling for large screens

### Fixed
- Split 512x512 icon into separate "any" and "maskable" entries for better compatibility

## [1.3.0] - 2025-12-30

### Added
- PWA manifest `id` property for improved install prompt behavior
- Cache busting for manifest.json via version query string
- AGENTS.md with AI instructions for codebase

### Changed
- Updated Gulp build to include manifest.json cache busting

## [1.2.0] - 2025-12-30

### Added
- Cache busting for CSS and JS assets via version query strings

## [1.1.0] - 2025-12-29

### Added
- Reset button to clear all checkboxes
- Reset button visibility toggle based on checkbox state

## [1.0.0] - 2025-12-29

### Added
- Initial release
- Daily feeding schedule for Murphy, Lyla, and Gilda
- Breakfast, lunch, and dinner tabs
- Checkbox persistence with localStorage
- Automatic checkbox reset at midnight
- PWA support with offline functionality
- Service worker with cache-first strategy
