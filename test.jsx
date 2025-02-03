import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { Edit, ChevronDown, ChevronUp, Users, Key, FileText } from "lucide-react";

const UserTypeList = () => {
    const [userTypeData, setUserTypeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const navigate = useNavigate();
  
    const fetchUserTypeData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/api/panel-fetch-usertype`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserTypeData(response.data?.userType || []);
        } catch (error) {
            console.error("Error fetching userType data", error);
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
        fetchUserTypeData();
    }, []);

    const toggleSection = (userId, section) => {
        setExpandedSections(prev => ({
            ...prev,
            [`${userId}-${section}`]: !prev[`${userId}-${section}`]
        }));
    };

    const formatRoleList = (roles) => {
        if (!roles) return [];
        return roles.split(",").map(role => role.trim());
    };

    const RoleSection = ({ title, roles, isExpanded, onToggle, icon: Icon }) => (
        <div className="mb-4">
            <div 
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={onToggle}
            >
                <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium">{title}</h3>
                </div>
                {roles && roles.length > 0 && (
                    <button className="text-gray-600">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                )}
            </div>
            {isExpanded && roles && roles.length > 0 && (
                <div className="mt-2 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {roles.map((role, index) => (
                            <div 
                                key={index}
                                className="bg-gray-50 px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors"
                            >
                                {role}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <Layout>
            <div className="max-w-screen p-4">
                {/* Header */}
                <div className="bg-white p-4 mb-6 rounded-lg shadow-sm">
                    <h1 className="text-2xl font-semibold border-b-2 border-dashed border-orange-800 pb-2 text-center md:text-left">
                        User Type List
                    </h1>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-800"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {userTypeData.map((user) => (
                            <div key={user.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                {/* Card Header */}
                                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-semibold">{user.user_role}</h2>
                                        <p className="text-sm text-gray-600">Type: {user.user_type}</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/master/tyremake-edit/${user.id}`)}
                                        className="p-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-50"
                                        title="Edit"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="p-4">
                                    <RoleSection 
                                        title="Default Button Roles"
                                        roles={formatRoleList(user.default_button_role)}
                                        isExpanded={expandedSections[`${user.id}-button`]}
                                        onToggle={() => toggleSection(user.id, 'button')}
                                        icon={Key}
                                    />
                                    
                                    <RoleSection 
                                        title="Default Page Roles"
                                        roles={formatRoleList(user.default_page_role)}
                                        isExpanded={expandedSections[`${user.id}-page`]}
                                        onToggle={() => toggleSection(user.id, 'page')}
                                        icon={FileText}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default UserTypeList;