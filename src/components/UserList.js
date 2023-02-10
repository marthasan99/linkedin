import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import { BiDotsVerticalRounded } from "react-icons/bi";

const UserList = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let [userList, setUserList] = useState([]);
  let [friendRequestList, setFriendRequestList] = useState([]);
  let [friendList, setFriendList] = useState([]);
  let [blockList, setBlockList] = useState([]);
  let [filterUserList, setFilterUserList] = useState([]);

  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid != item.key) {
          arr.push({ ...item.val(), userId: item.key });
        }
      });
      setUserList(arr);
    });
  }, []);

  let handleFriendRequest = (item) => {
    set(push(ref(db, "friendRequest/")), {
      senderName: data.displayName,
      senderId: data.uid,
      receiverName: item.username,
      receiverId: item.userId,
    });
  };
  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest");
    onValue(friendRequestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().senderId + item.val().receiverId);
      });
      setFriendRequestList(arr);
    });
  }, []);
  useEffect(() => {
    const friendsRef = ref(db, "friends");
    onValue(friendsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().senderId + item.val().receiverId);
      });
      setFriendList(arr);
    });
  }, []);
  useEffect(() => {
    const blockRef = ref(db, "blocked");
    onValue(blockRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().blockId + item.val().blockById);
      });
      setBlockList(arr);
    });
  }, []);
  let handleSearch = (e) => {
    let arr = [];
    userList.filter((item) => {
      if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
        arr.push(item);
      }
      setFilterUserList(arr);
    });
  };
  return (
    <div className="drop-shadow-group h-[462px] w-full overflow-y-scroll rounded-lg bg-white py-3 px-5">
      <h3 className="font-poppins text-xl font-semibold">User List</h3>
      <div className="relative">
        <input
          onChange={handleSearch}
          className="shadow-search  w-full rounded-[20px] border bg-white px-[78px] py-5 outline-none"
          type="text"
          placeholder="Search"
        />
        <FiSearch className="absolute top-6 left-7" />
        <BiDotsVerticalRounded className="absolute top-6 right-7 cursor-pointer text-[#181818]" />
      </div>
      {}
      {userList.length == 0 ? (
        <p className="font-poppins text-sub mt-5 text-sm font-medium">
          No Users available right now
        </p>
      ) : filterUserList.length > 0 ? (
        filterUserList.map((item) => (
          <div className="flex items-center justify-between pt-4">
            <div className="pr-3.5">
              <picture>
                <img src="images/group-list.png" alt="" />
              </picture>
            </div>
            <div className="">
              <h4 className="font-poppins text-lg font-semibold">
                {item.username}
              </h4>
              <p className="font-poppins text-sub text-sm font-medium">
                {item.email}
              </p>
            </div>
            <div className="">
              {blockList.includes(data.uid + item.userId) ||
              blockList.includes(item.userId + data.uid) ? (
                <button className="font-poppins bg-[#181818] px-5 text-xl font-semibold text-white">
                  Block
                </button>
              ) : friendList.includes(data.uid + item.userId) ||
                friendList.includes(item.userId + data.uid) ? (
                <button className="font-poppins bg-[#181818] px-5 text-xl font-semibold text-white">
                  Friend
                </button>
              ) : friendRequestList.includes(data.uid + item.userId) ||
                friendRequestList.includes(item.userId + data.uid) ? (
                <button className="font-poppins bg-[#181818] px-5 text-xl font-semibold text-white">
                  Pending
                </button>
              ) : (
                <button
                  onClick={() => handleFriendRequest(item)}
                  className="font-poppins bg-[#181818] px-5 text-xl font-semibold text-white"
                >
                  Add Friend
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        userList.map((item) => (
          <div className="flex items-center justify-between pt-4">
            <div className="pr-3.5">
              <picture>
                <img src="images/group-list.png" alt="" />
              </picture>
            </div>
            <div className="">
              <h4 className="font-poppins text-lg font-semibold">
                {item.username}
              </h4>
              <p className="font-poppins text-sub text-sm font-medium">
                {item.email}
              </p>
            </div>
            <div className="">
              {blockList.includes(data.uid + item.userId) ||
              blockList.includes(item.userId + data.uid) ? (
                <button className="font-poppins bg-[#181818] px-5 text-xl font-semibold text-white">
                  Block
                </button>
              ) : friendList.includes(data.uid + item.userId) ||
                friendList.includes(item.userId + data.uid) ? (
                <button className="font-poppins bg-[#181818] px-5 text-xl font-semibold text-white">
                  Friend
                </button>
              ) : friendRequestList.includes(data.uid + item.userId) ||
                friendRequestList.includes(item.userId + data.uid) ? (
                <button className="font-poppins bg-[#181818] px-5 text-xl font-semibold text-white">
                  Pending
                </button>
              ) : (
                <button
                  onClick={() => handleFriendRequest(item)}
                  className="font-poppins bg-[#181818] px-5 text-xl font-semibold text-white"
                >
                  Add Friend
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;
