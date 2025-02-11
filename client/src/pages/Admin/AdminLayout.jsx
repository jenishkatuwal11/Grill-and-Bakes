import { useState } from "react";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// PropTypes validation
AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
