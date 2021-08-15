import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { VscBell, VscBellDot } from 'react-icons/vsc'
import { Link } from 'react-router-dom';
import { useAuth } from '../../firebase/Auth';
import { db } from '../../firebase/config';
import './notifications.css'

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        style={{ color: 'inherit', }}
        className='cursor'
    >
        {children}
        <VscBell size="2em" />
    </span>
));

const CustomToggleDot = React.forwardRef(({ children, onClick, changeStatus }, ref) => {

    const { currentUser } = useAuth()

    return (
        <span
            ref={ref}
            onClick={async (e) => {
                e.preventDefault();
                onClick(e);
                await db.collection('users').doc(currentUser).update({
                    unseen_notifications: false
                })
                changeStatus(false)
            }}
            style={{ color: 'inherit', }}
            className='cursor'
        >
            {children}
            <VscBellDot size="2em" />
        </span>
    )
});

const CustomLink = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => (
    <Link to={children.path} ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}>
        <div className="notiContent">{children.content}</div>
        <div className="notiTime">{children.time.toDate().toLocaleString()}</div>
    </Link>
))

const NotificationContainer = () => {

    const { currentUser } = useAuth()

    const [unseenNotifications, setUnseenNotifications] = useState(null)

    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        async function getUserNotiStatus() {
            try {
                const res = await db.collection('users').doc(currentUser).get()
                const data = res.data()
                setUnseenNotifications(data.unseen_notifications)
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getUserNotiStatus()
    }, [currentUser])

    useEffect(() => {
        async function getNotificationList() {
            try {
                const res = await db.collection('users').doc(currentUser).get()
                const data = res.data()
                const notiList = data.notifications
                var detailNotiList = []
                for (var i = 0; i < notiList.length; i++) {
                    const res = await db.collection('notifications').doc(notiList[i]).get()
                    const data = res.data()
                    detailNotiList.unshift(data)
                }
                setNotifications(detailNotiList)
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getNotificationList()
    }, [currentUser, unseenNotifications])


    return (
        <Dropdown>
            {unseenNotifications === true && <Dropdown.Toggle changeStatus={setUnseenNotifications} as={CustomToggleDot} id="dropdown-custom-components" />}
            {unseenNotifications === false && <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />}
            <Dropdown.Menu>
                {notifications.length === 0 && "No notifications"}
                {notifications.length > 0 && notifications.map(noti => {
                    return <Dropdown.Item as={CustomLink} to="/profile">{noti}</Dropdown.Item>
                })}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default NotificationContainer;