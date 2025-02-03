# DFC CRM

## Overview
DFC CRM is a customer relationship management (CRM) system developed by **AG Solutions**. This application is designed to streamline operations for managing agencies, vendors, vehicles, payments, reports, and more. The project is built using **React (Vite)** and integrates several libraries for UI components, state management, charts, and API handling.

## Features
- **User Authentication** (Sign In, Sign Up, Forget Password)
- **Dashboard** for data visualization
- **User Management** with role-based access control
- **Master Data Management** for agencies, branches, vendors, drivers, etc.
- **Payment Processing** with advance, branch, and detailed payments
- **Reports Module** for generating detailed reports
- **Service Management** for handling customer services
- **Trip Management** including trip creation and tracking
- **Tyre and Vehicle Management**
- **UI Components** using Mantine, MUI, and Tailwind CSS
- **Charts and Data Visualization** with ApexCharts and Chart.js

## Tech Stack
- **Frontend**: React (Vite)
- **UI Libraries**: MUI, Mantine, Tailwind CSS
- **State Management**: React Context API, React Query
- **Routing**: React Router
- **Data Handling**: Axios, Lodash
- **Charting**: ApexCharts, Chart.js
- **PDF & Reports**: jsPDF, html2pdf.js, pdfmake
- **Security**: JWT Authentication, CryptoJS

## Project Structure
```
DFC-CRM/
├── public/                     # Static assets
├── src/                        # Source code
│   ├── assets/                 # Images and logos
│   ├── base/                   # Base API configurations
│   ├── components/             # Reusable UI components
│   │   ├── buttonIndex/        # Button components
│   │   ├── common/             # Common reusable components
│   ├── configs/                # Configurations for charts and settings
│   ├── context/                # Global state management
│   ├── data/                   # Static sample data for testing
│   ├── json/                   # JSON files for menu and settings
│   ├── layout/                 # Page layouts and structural components
│   ├── pages/                  # Page-specific components
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # Main dashboard
│   │   ├── master/             # Master data management
│   │   ├── payment/            # Payment management
│   │   ├── profile/            # User profile
│   │   ├── reports/            # Reporting module
│   │   ├── services/           # Service management
│   │   ├── trip/               # Trip management
│   │   ├── tyre/               # Tyre management
│   │   ├── userManagement/     # User management
│   │   ├── vehicles/           # Vehicle management
│   ├── utils/                  # Utility functions
├── package.json                # Project dependencies and scripts
├── tailwind.config.cjs         # Tailwind CSS configuration
├── vite.config.js              # Vite configuration
```

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [Git](https://git-scm.com/)

### Steps to Run the Project
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/dfc-crm.git
   cd dfc-crm
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be accessible at `http://localhost:5173`.

### Build for Production
To generate the production build, run:
```sh
npm run build
```



## Available Scripts
| Command        | Description |
|---------------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint to check code quality |

## Dependencies
### Main Dependencies
- **React** (UI framework)
- **React Router** (Routing)
- **Axios** (API requests)
- **Mantine & MUI** (UI components)
- **React Query** (State management)
- **Chart.js & ApexCharts** (Charts)
- **Lodash & Moment.js** (Utilities)
- **jsPDF & pdfmake** (PDF generation)

### Dev Dependencies
- **Vite** (Development server)
- **ESLint** (Code linting)
- **Tailwind CSS** (Utility-first CSS framework)

## Contribution Guidelines
1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes with meaningful messages.
4. Push to your fork and create a Pull Request.

## License
This project is owned by **AG Solutions Private Property** and is not open-source.

## Contact
For any queries, contact **AG Solutions Private Property** at:
📧 Email: info@ag-solutions.in
🌐 Website: [www.ag-solutions.in](https://ag-solutions.in/)

---
> *DFC CRM - A Complete CRM Solution for Businesses*

