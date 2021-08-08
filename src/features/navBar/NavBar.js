import React from 'react';
import { useAuth } from '../../firebase/Auth';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import './navbar.css'

const NavBar = () => {
    const { signout } = useAuth();

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'wrap', position: "sticky", top: 0 }}>
            <CDBSidebar textColor="#fff" backgroundColor="#333">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <a
                        className="text-decoration-none"
                        style={{ color: 'inherit' }}
                    >
                        Tasker
                    </a>
                </CDBSidebarHeader>
                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <NavLink exact to="/profile" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="user">Profile</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/groups" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="columns">Groups</CDBSidebarMenuItem>
                        </NavLink>
                        <a href="/login" onClick={signout}>
                            <CDBSidebarMenuItem icon="sign-out-alt">Sign Out</CDBSidebarMenuItem>
                        </a>
                    </CDBSidebarMenu>
                </CDBSidebarContent>
                <CDBSidebarFooter style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            padding: '20px 5px',
                        }}
                    >
                        By Hung Ng
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    )
}

export default NavBar;