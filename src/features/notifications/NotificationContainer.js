import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { VscBell, VscBellDot, VscLoading } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { useAuth } from "../../authentication/AuthProvider";
import { db } from "../../authentication/config";
import "./notifications.css";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <span
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ color: "inherit" }}
    className="cursor"
  >
    {children}
    <VscBell size="2em" />
  </span>
));

const CustomToggleDot = React.forwardRef(
  ({ children, onClick, changeStatus }, ref) => {
    const { currentUser } = useAuth();

    return (
      <span
        ref={ref}
        onClick={async (e) => {
          e.preventDefault();
          onClick(e);
          await db.collection("users").doc(currentUser.email).update({
            unseen_notifications: false,
          });
          changeStatus(false);
        }}
        style={{ color: "inherit" }}
        className="cursor"
      >
        {children}
        <VscBellDot size="2em" />
      </span>
    );
  }
);

const CustomLink = React.forwardRef(({ children, style, className }, ref) => (
  <Link to={children.path} ref={ref} style={style} className={className}>
    <div className="notiContent">{children.content}</div>
    <div className="notiTime">{children.time.toDate().toLocaleString()}</div>
  </Link>
));

const NotificationContainer = () => {
  const { currentUser } = useAuth();

  const [unseenNotifications, setUnseenNotifications] = useState(null);

  const [notificationIdList, setNotificationIdList] = useState([]);

  const [notificationDetailList, setNotificationDetailList] = useState([]);

  const [lastKey, setLastKey] = useState("");

  const [nextNotificationsLoading, setNextNotificationsLoading] =
    useState(false);

  const notificationDetailNextBatch = async (key) => {
    try {
      let notis = [];
      let lastKey = 0;
      for (var i = key + 1; i < key + 6; i++) {
        if (i + 1 > notificationIdList.length) {
          lastKey = -1;
        } else {
          const res = await db
            .collection("notifications")
            .doc(notificationIdList[i])
            .get();
          notis.push(res.data());
          lastKey = i;
        }
      }
      if (notificationIdList.length === key + 6) {
        lastKey = -1;
      }
      setLastKey(lastKey);
      setNotificationDetailList(notificationDetailList.concat(notis));
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchMoreNotifications = (key) => {
    if (key >= 0) {
      setNextNotificationsLoading(true);
      notificationDetailNextBatch(key);
      setNextNotificationsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function getUserNotiStatus() {
      try {
        const res = await db.collection("users").doc(currentUser.email).get();
        const data = res.data();
        if (isMounted) {
          setUnseenNotifications(data.unseen_notifications);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    getUserNotiStatus();

    return () => (isMounted = false);
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;
    async function getNotificationIdList() {
      try {
        const res = await db.collection("users").doc(currentUser.email).get();
        const data = res.data();
        var notiList = data.notifications;
        notiList.reverse();
        if (isMounted) {
          setNotificationIdList(notiList);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    getNotificationIdList();

    return () => (isMounted = false);
  }, [currentUser, unseenNotifications]);

  useEffect(() => {
    let isMounted = true;
    async function notificationDetailFirstBatch() {
      try {
        let notis = [];
        let lastKey = 0;
        for (var i = 0; i < 5; i++) {
          if (i + 1 > notificationIdList.length) {
            lastKey = -1;
          } else {
            const res = await db
              .collection("notifications")
              .doc(notificationIdList[i])
              .get();
            const data = res.data();
            notis.push(data);
            lastKey = i;
          }
        }
        if (notificationIdList.length === 5) {
          lastKey = -1;
        }
        if (isMounted) {
          setNotificationDetailList(notis);
          setLastKey(lastKey);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    notificationDetailFirstBatch();

    return () => (isMounted = false);
  }, [notificationIdList]);

  return (
    <Dropdown>
      {unseenNotifications === true && (
        <Dropdown.Toggle
          changeStatus={setUnseenNotifications}
          as={CustomToggleDot}
          id="dropdown-custom-components"
        />
      )}
      {unseenNotifications === false && (
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
      )}
      <Dropdown.Menu style={{ overflow: "auto", maxHeight: "50vh" }}>
        {notificationDetailList.length === 0 && (
          <div className="noNoti">No Notifications</div>
        )}
        {notificationDetailList.length > 0 &&
          notificationDetailList.map((noti, index) => {
            return (
              <Dropdown.Item as={CustomLink} key={index}>
                {noti}
              </Dropdown.Item>
            );
          })}
        <div style={{ textAlign: "center" }}>
          {nextNotificationsLoading && <VscLoading />}
          {lastKey >= 0 && (
            <button onClick={() => fetchMoreNotifications(lastKey)}>
              More Notifications
            </button>
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationContainer;
