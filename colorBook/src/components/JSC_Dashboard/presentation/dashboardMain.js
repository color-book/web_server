import React from 'react'
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import PropTypes from 'prop-types'
import Select from 'react-select';
import Sidebar from "react-sidebar";

// COMPONENTS
import TimePunchContainer from '../container/timePunch'

const Dashboard = ({currentPage, usersName, sidebarOpen, setSidebarOpen}) =>  {

  let sidebarContent = <div className="dashboard-sidebar">
    <h5 className="sidebar-welcome">Hey, {usersName}</h5>
    <ul>
      {currentPage !== "create-a-job" && <li><a href="/dashboard/create-a-job">Create a New Job</a></li>}
      {currentPage !== "dashboard" && <li><a href="/dashboard">Clock Into a Job</a></li>}
      <li><a href="/settings">Settings</a></li>
    </ul>
  </div>

  let setCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
          return <TimePunchContainer />
      case 'create-a-job':
        return <div>Create a job!</div>
      default:
        break;
    }
  }

  return (
    <main>
      {/* <Sidebar
        sidebar={sidebarContent}
        open={sidebarOpen}
        onSetOpen={setSidebarOpen}
        styles={{ sidebar: { background: "white", width: "50vw" } }}
        >
        <nav className="dashboard-nav">
          <div className="dashboard-nav-left">
            <span onClick={setSidebarOpen}><img src="/static/img/menu.svg" /></span>
          </div>
          <div className="dashboard-nav-right">
            <h4>Color Book</h4>
          </div>
        </nav> */}

        {setCurrentPage()}

      {/* </Sidebar> */}
    </main>
  )
}

Dashboard.propTypes = {

};

export default Dashboard;