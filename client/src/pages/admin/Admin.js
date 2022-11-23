import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../../context/MainContext'
import AdminBooks from './AdminBooks';
import AdminUsers from './AdminUsers';

const Admin = () => {
	return (
		<main>
			<div className="container">
                <AdminBooks/>
                <AdminUsers/>
			</div>
		</main>
	);
};

export default Admin;
