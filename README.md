# NetSentry AI

NetSentry AI is a full-stack, ML-assisted network-security
monitoring platform that helps users identify, understand and
investigate suspicious activity within network-traffic data.

## Project Status

Requirement Gathering and System Analysis

## Problem Statement

Network datasets can contain thousands of technical records,
making manual inspection difficult and time-consuming. Junior
security analysts may struggle to identify unusual patterns,
prioritize serious alerts and understand why particular network
connections are suspicious.

NetSentry AI addresses this problem by transforming network-flow
data into visual summaries, prioritized security alerts,
understandable anomaly explanations and manageable investigation
workflows.

## Project Objectives

- Analyse uploaded network-traffic datasets.
- Detect potentially anomalous network records.
- Present network activity through an understandable dashboard.
- Generate and prioritize security alerts.
- Explain why network records were flagged.
- Support alert investigation and status management.
- Generate basic incident reports.
- Maintain secure role-based access.

## Target Users

### Security Analyst

Monitors network activity, investigates alerts, records findings
and generates incident reports.

### System Administrator

Manages user accounts, roles, datasets, settings and audit logs.

## Main Workflow

1. An authorized user logs in.
2. The user uploads a network-traffic CSV file.
3. NetSentry validates and preprocesses the dataset.
4. The ML model calculates anomaly scores.
5. Suspicious records are converted into security alerts.
6. An analyst investigates the generated alerts.
7. The analyst resolves alerts or marks them as false positives.
8. The user generates a security report.

## Planned Features

- Secure authentication
- Role-based access control
- Network CSV upload and validation
- Network-traffic dashboard
- Searchable traffic records
- ML-assisted anomaly detection
- Security-alert management
- Investigation notes
- False-positive management
- Incident-report generation
- User management
- Audit logs

## Planned Technology Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Recharts

### Backend

- Python
- FastAPI

### Database

- PostgreSQL

### Machine Learning

- Pandas
- Scikit-learn
- Isolation Forest

### DevOps and Cloud

- Docker
- GitHub Actions
- AWS or Microsoft Azure

## Documentation

Project documentation will be maintained inside the `docs`
directory.

- Requirements Analysis
- UML Diagrams
- UI/UX Design
- System Architecture
- Machine-Learning Development
- Security Testing
- Deployment
- Final Report

## Ethical Use

NetSentry AI is intended for educational and authorized security
testing only. Network data must only be collected or analysed with
appropriate authorization.

## Author

Chalani Kaushalya
