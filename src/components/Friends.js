import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  push,
} from "firebase/database";
import { useSelector, useDispatch } from "react-redux";

const Friends = () => {
  const db = getDatabase();
  let dispatch = useDispatch();
  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let [friend, setFriend] = useState([]);
  useEffect(() => {
    const friendsRef = ref(db, "friends/");
    onValue(friendsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          data.uid == item.val().receiverId ||
          data.uid == item.val().senderId
        ) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setFriend(arr);
    });
  }, []);
  let handleBlock = (item) => {
    if (data.uid == item.senderId) {
      set(push(ref(db, "blocked/")), {
        block: item.receiverName,
        blockId: item.receiverId,
        blockBy: item.senderName,
        blockById: item.senderId,
      }).then(remove(ref(db, "friends/" + item.key)));
    } else {
      set(push(ref(db, "blocked/")), {
        block: item.senderName,
        blockId: item.senderId,
        blockBy: item.receiverName,
        blockById: item.receiverId,
      }).then(remove(ref(db, "friends/" + item.key)));
    }
  };
  return (
    <div className="drop-shadow-group h-[462px] w-full overflow-y-scroll rounded-lg bg-white py-3 px-5">
      <h3 className="font-poppins text-xl font-semibold">Friends</h3>
      {friend.length == 0 ? (
        <p className="font-poppins text-sub mt-5 text-sm font-medium">
          No friends available right now
        </p>
      ) : (
        friend.map((item) => (
          <div className="flex items-center justify-start pt-4">
            <div className="pr-3.5">
              <picture>
                <img src="images/group-list.png" alt="" />
              </picture>
            </div>
            <div className="pr-[51px]">
              <h4 className="font-poppins text-lg font-semibold">
                {item.senderId == data.uid
                  ? item.receiverName
                  : item.senderName}
              </h4>
              <p className="font-poppins text-sub text-sm font-medium">
                Hi Guys, Wassup!
              </p>
            </div>
            <div className="">
              <button
                onClick={() => handleBlock(item)}
                className="font-poppins bg-[#181818] px-5 text-xl font-semibold text-white"
              >
                Block
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Friends;
