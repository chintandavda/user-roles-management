# **Roles Management**

This is a **Full Stack Roles Management App** built with:

-   **Backend**: Django REST Framework (DRF)
-   **Frontend**: React.js with Ant Design
-   **Authentication**: JWT-based authentication
-   **Database**: PostgreSQL (or SQLite for local development)

## **Features**

-   **Admin**: Manage Relationship Managers (RMs) and Clients
-   **RM (Relationship Manager)**: Manage assigned Clients & Approve/Reject Requests
-   **Client**: Submit data change requests & view their dashboard
-   **Role-Based Access Control**
-   **Secure JWT Authentication**

---

## **1. Setup the Backend (Django API)**

### **1.1 Clone the Repository**

```bash
git clone https://github.com/chintandavda/user-roles-management.git
cd backend
```

### **1.2 Create and Activate Virtual Environment**

```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate  # Windows
```

### **1.3 Install Dependencies**

```bash
pip install -r requirements.txt
```

### **1.4 Apply Migrations**

```bash
python manage.py migrate
```

### **1.5 Create Superuser (Admin Login)**

```bash
python manage.py createsuperuser
```

### **1.6 Run the Server**

```bash
python manage.py runserver
```

✅ The backend will now run at `http://127.0.0.1:8000/`

---

## **2. Setup the Frontend (React.js)**

### **2.1 Navigate to the Frontend Directory**

```bash
cd frontend
```

### **2.2 Install Dependencies**

```bash
npm install
```

### **2.3 Start the React Development Server**

```bash
npm start
```

✅ The frontend will now run at `http://localhost:3000/`

---

## **3. API Endpoints**

### **Authentication**

-   `POST /api/users/login/` - Login and get JWT token
-   `POST /api/users/register-rm/` - Register an RM (Admin Only)
-   `POST /api/users/register-client/` - Register a Client (RM Only)

### **Admin Endpoints**

-   `GET /api/users/admin/rms-clients/` - List all RMs and associated Clients
-   `GET /api/users/admin-dashboard/` - Admin Dashboard Statistics

### **RM Endpoints**

-   `GET /api/users/rm-dashboard/<rm_id>/` - View RM dashboard
-   `GET /api/users/rm/view-requests/` - View pending client requests
-   `PATCH /api/users/rm/update-request/<request_id>/` - Approve/Reject request

### **Client Endpoints**

-   `GET /api/users/client-dashboard/<client_id>/` - View Client dashboard
-   `POST /api/users/request-change/` - Submit a change request

---

## **4. Tech Stack Used**

### **Backend**

-   Django REST Framework
-   SQLite
-   JWT Authentication
-   CORS & Middleware

### **Frontend**

-   React.js
-   Ant Design (UI Library)
-   Axios (API Calls)
-   React Router
