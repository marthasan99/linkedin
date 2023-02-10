import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";

const FriendRequest = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let [friendRequestList, setFriendRequestList] = useState([]);

  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest/");
    onValue(friendRequestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().receiverId) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setFriendRequestList(arr);
    });
  }, []);

  let handleAccept = (item) => {
    console.log(item.id);
    set(push(ref(db, "friends/")), {
      ...item,
    }).then(remove(ref(db, "friendRequest/" + item.id)));
  };

  return (
    <div className="drop-shadow-group mt-11 h-[462px] w-full overflow-y-scroll rounded-lg bg-white py-3 px-5">
      <h3 className="font-poppins text-xl font-semibold">Friend Request</h3>
      {friendRequestList.length == 0 ? (
        <p className="font-poppins text-sub mt-5 text-sm font-medium">
          No Friend request available right now
        </p>
      ) : (
        friendRequestList.map((item) => (
          <div className="flex items-center justify-start pt-4">
            <div className="pr-3.5">
              <picture>
                <img src="images/group-list.png" alt="" />
              </picture>
            </div>
            <div className="pr-[51px]">
              <h4 className="font-poppins text-lg font-semibold">
                {item.senderName}
              </h4>
              <p className="font-poppins text-sub text-sm font-medium">
                Hi Guys, Wassup!
              </p>
            </div>
            <div className="">
              <button
                onClick={() => handleAccept(item)}
                className="font-poppins bg-[#181818] px-5 text-xl font-semibold text-white"
              >
                Accept
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendRequest;
