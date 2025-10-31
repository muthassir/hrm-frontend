import { Link } from "react-router-dom";

const PublicDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5">
            <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our HR Management System</h2>
          <p className="text-xl mb-8">Streamline your employee management, attendance tracking, and more</p>
          <Link to="/register" className="btn btn-secondary btn-lg">Get Started</Link>
        </div>
      </section>

      {/* features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-primary">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-base-100 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">⏰</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Attendance Tracking</h4>
              <p className="text-gray-600">Geolocation-based check-in/out system with radius validation</p>
            </div>
            
            <div className="text-center p-6 bg-base-100 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">👥</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Employee Management</h4>
              <p className="text-gray-600">Comprehensive employee profiles and department management</p>
            </div>
            
            <div className="text-center p-6 bg-base-100 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">📊</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Analytics & Reports</h4>
              <p className="text-gray-600">Detailed attendance reports and export functionality</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicDashboard;