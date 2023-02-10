import React, { useState, useEffect } from "react";
import Container from "../components/Container";
import { BiEdit } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  update,
} from "firebase/database";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlinePoweroff } from "react-icons/ai";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref as sref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import Project from "../components/Project";
import Experience from "../components/Experience";
import UserList from "../components/UserList";
import Friends from "../components/Friends";
import FriendRequest from "../components/FriendRequest";
import BlockedUser from "../components/BlockedUser";
import { useNavigate } from "react-router-dom";
import { userLoginInfo } from "../slices/userSlice";

const Profile = () => {
  const auth = getAuth();
  const storage = getStorage();
  const db = getDatabase();
  const navigate = useNavigate;
  const dispatch = useDispatch;
  let [active, setActive] = useState(true);
  let [active2, setActive2] = useState(true);
  let [showEditProfile, setShowEditProfile] = useState(false);
  let [postList, setPostList] = useState([]);
  let [postDropdown, setPostDropdown] = useState(false);
  let [imageUploadModal, setImageUploadModal] = useState(false);
  let [bio, setBio] = useState("");
  let [coverAndBioList, setCoverAndBioList] = useState([]);

  const [image, setImage] = useState();
  const [coverImage, setCoverImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [cropData2, setCropData2] = useState("#");
  const [cropper2, setCropper2] = useState();

  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let handleProfile = () => {
    setActive(true);
    setActive2(false);
  };
  let handlePost = () => {
    setActive(false);
    setActive2(false);
  };
  let handleFriend = () => {
    setActive(true);
    setActive2(true);
  };

  let handleShowEditProfile = () => {
    setShowEditProfile(!showEditProfile);
  };

  useEffect(() => {
    const posts = ref(db, "post/");
    onValue(posts, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), key: item.key });
      });
      setPostList(arr);
    });
  }, []);
  let handlePostDropdown = () => {
    setPostDropdown(!postDropdown);
  };
  let handleRemovePost = (item) => {
    remove(ref(db, "post/" + item.key));
  };
  let handleImageUpload = () => {
    setImageUploadModal(true);
  };
  const handleProfileUpload = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const handleCoverUpload = (e) => {
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());

      const storageRef = sref(storage, `profileImage${Math.random()}`);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            setImageUploadModal(false);
            setImage("");
            setCropData("#");
            setCropper("");
          });
        });
      });
    }
  };
  const getCropData2 = (item) => {
    if (typeof cropper2 !== "undefined") {
      setCropData2(cropper2.getCroppedCanvas().toDataURL());

      const storageRef2 = sref(storage, `coverImage${Math.random()}`);
      const message4 = cropper2.getCroppedCanvas().toDataURL();
      uploadString(storageRef2, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef2).then((downloadURL) => {
          item
            ? update(ref(db, "coverAndBio/" + item.key), {
                image: downloadURL,
                bio: bio,
              }).then(() => {
                setShowEditProfile(!showEditProfile);
                setCoverImage("");
                setCropData2("#");
                setCropper2("");
              })
            : set(push(ref(db, "coverAndBio")), {
                whoLoginid: data.uid,
                image: downloadURL,
                bio: bio,
              }).then(() => {
                setShowEditProfile(!showEditProfile);
                setCoverImage("");
                setCropData2("#");
                setCropper2("");
              });
        });
      });
    }
  };
  let handleCancel = () => {
    setImageUploadModal(false);
    setImage("");
    setCropData("#");
    setCropper("");
  };
  let handleCancel2 = () => {
    setCoverImage("");
    setCropData2("#");
    setCropper2("");
  };

  let handleBio = (e) => {
    setBio(e.target.value);
  };
  let handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("logout Done");
        localStorage.removeItem("userInfo");
        dispatch(userLoginInfo);
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  useEffect(() => {
    const coverAndBio = ref(db, "coverAndBio/");
    onValue(coverAndBio, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), key: item.key });
      });
      setCoverAndBioList(arr);
    });
  }, []);

  return (
    <>
      <div className="bg-[#F7F9FB]">
        <div className="relative">
          <img src="images/logo.png" alt="" />
          <AiOutlinePoweroff
            onClick={handleLogout}
            className="absolute top-2 right-5 cursor-pointer"
          />
        </div>
        <Container>
          <div className="flex gap-x-10">
            <div className="w-[850px]">
              {coverAndBioList.map(
                (item) =>
                  item.whoLoginid == data.uid && (
                    <>
                      <div>
                        <div className="relative">
                          <img src={item.image} alt="" />
                          <div className="group absolute left-6 translate-y-[-10%]">
                            <div
                              onClick={handleImageUpload}
                              className="absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[rgba(0,0,0,.41)] opacity-0 group-hover:opacity-100"
                            >
                              <IoMdCloudUpload className="text-2xl text-white" />
                            </div>
                            <img
                              src={
                                data.photoURL
                                  ? data.photoURL
                                  : "images/demo-profile.jpg"
                              }
                              alt=""
                              className="h-[170px] w-[170px] rounded-full"
                            />
                          </div>
                          <div
                            onClick={handleShowEditProfile}
                            className="absolute top-0 right-0 mt-5 mr-14 cursor-pointer bg-white p-2.5"
                          >
                            <BiEdit className="mr-4 inline-block" />
                            <p className="font-regular inline-block font-nunito text-sm text-[#181818]">
                              Edit profile
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-52 mt-6">
                        <p className="mb-2.5  font-nunito text-lg font-bold text-[#181818]">
                          {data.displayName}
                        </p>
                        <p className="font-regular mb-3.5 font-nunito text-sm text-[#181818]">
                          {item.bio}
                        </p>
                        <button className="bg-[#0E6795] py-2.5 px-12 font-nunito text-xs font-medium uppercase text-white">
                          Contact info
                        </button>
                      </div>
                    </>
                  )
              )}
              <div className="mt-6">
                <div className="flex">
                  {active ? (
                    active2 ? (
                      <>
                        <p
                          className="rounded-t bg-white py-4 px-24 font-nunito text-xs font-medium uppercase text-[#181818]"
                          onClick={handleProfile}
                        >
                          Profile
                        </p>
                        <p
                          onClick={handlePost}
                          className="rounded-t bg-white py-4 px-24 font-nunito text-xs font-medium uppercase text-[#181818]"
                        >
                          Post
                        </p>
                        <p
                          onClick={handleFriend}
                          className="rounded-t bg-[#0E6795] py-4 px-24 font-nunito text-xs font-medium uppercase text-white "
                        >
                          Friend
                        </p>
                      </>
                    ) : (
                      <>
                        <p
                          className="rounded-t bg-[#0E6795] py-4 px-24 font-nunito text-xs font-medium uppercase text-white "
                          onClick={handleProfile}
                        >
                          Profile
                        </p>
                        <p
                          onClick={handlePost}
                          className="rounded-t bg-white py-4 px-24 font-nunito text-xs font-medium uppercase text-[#181818]"
                        >
                          Post
                        </p>
                        <p
                          onClick={handleFriend}
                          className="rounded-t bg-white py-4 px-24 font-nunito text-xs font-medium uppercase text-[#181818]"
                        >
                          Friend
                        </p>
                      </>
                    )
                  ) : (
                    <>
                      <p
                        className="rounded-t bg-white py-4 px-24 font-nunito text-xs font-medium uppercase text-[#181818] "
                        onClick={handleProfile}
                      >
                        Profile
                      </p>
                      <p
                        className="rounded-t bg-[#0E6795] py-4 px-24 font-nunito text-xs font-medium uppercase text-white "
                        onClick={handlePost}
                      >
                        Post
                      </p>
                      <p
                        onClick={handleFriend}
                        className="rounded-t bg-white py-4 px-24 font-nunito text-xs font-medium uppercase text-[#181818]"
                      >
                        Friend
                      </p>
                    </>
                  )}
                </div>
                <div>
                  {active ? (
                    active2 ? (
                      <div>
                        <div className="mb-5 mt-8 bg-white p-8">
                          <h4 className="mb-2.5 font-nunito text-lg font-bold text-[#181818]">
                            Friends
                          </h4>
                        </div>
                        <UserList />
                        <Friends />
                        <FriendRequest />
                      </div>
                    ) : (
                      <div>
                        <div className="mb-5 mt-8 bg-white p-8">
                          <h4 className="mb-2.5 font-nunito text-lg font-bold text-[#181818]">
                            About
                          </h4>
                          <p className="font-regular mb-5 font-nunito text-sm text-[#181818]">
                            I'm more experienced in eCommerce web projects and
                            mobile banking apps, but also like to work with
                            creative projects, such as landing pages or unusual
                            corporate websites.
                          </p>
                          <a
                            href="./"
                            className="mb-5 font-nunito text-xs font-medium uppercase text-[#0275B1]"
                          >
                            See more
                          </a>
                        </div>
                        <Project />
                        <Experience />
                      </div>
                    )
                  ) : (
                    <div className=" mt-8">
                      {postList.map((item) =>
                        item.whoPostId == data.uid && item.image ? (
                          <>
                            <div className="mb-5  bg-white pb-24">
                              <div
                                onClick={handlePostDropdown}
                                className="relative flex justify-end border-b border-solid border-[#f4f4f4] py-6"
                              >
                                <BsThreeDots className=" mr-5" />
                                {postDropdown && (
                                  <div
                                    onClick={() => handleRemovePost(item)}
                                    className="absolute bottom-[-20px] right-5 cursor-pointer bg-[#181818] px-5 py-2.5"
                                  >
                                    <p className="text-white">Remove post</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex px-8 pt-4">
                                <div>
                                  <img src="images/profile.png" />
                                </div>
                                <div className="flex flex-col justify-center pl-4">
                                  <p className="font-nunito text-sm font-bold text-[#181818]">
                                    {item.whoPostName}
                                  </p>
                                  <p className="font-regular font-nunito text-[10px] text-[#181818]">
                                    iOS developer
                                  </p>
                                  <p className="font-regular font-nunito text-[10px] text-[#181818]">
                                    {moment(
                                      item.date,
                                      "YYYYMMDD hh:mm"
                                    ).fromNow()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-y-4 px-8 pt-4">
                                <p className="font-regular font-nunito text-sm text-[#181818]">
                                  {item.post}
                                </p>
                                <img src={item.image} alt="" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mb-5 bg-white pb-24">
                              <div
                                onClick={handlePostDropdown}
                                className="relative flex justify-end border-b border-solid border-[#f4f4f4] py-6"
                              >
                                <BsThreeDots className=" mr-5" />
                                {postDropdown && (
                                  <div
                                    onClick={() => handleRemovePost(item)}
                                    className="absolute bottom-[-20px] right-5 cursor-pointer bg-[#181818] px-5 py-2.5"
                                  >
                                    <p className="text-white">Remove post</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex px-8 pt-4">
                                <div>
                                  <img src="images/profile.png" />
                                </div>
                                <div className="flex flex-col justify-center pl-4">
                                  <p className="font-nunito text-sm font-bold text-[#181818]">
                                    {item.whoPostName}
                                  </p>
                                  <p className="font-regular font-nunito text-[10px] text-[#181818]">
                                    iOS developer
                                  </p>
                                  <p className="font-regular font-nunito text-[10px] text-[#181818]">
                                    {moment(
                                      item.date,
                                      "YYYYMMDD hh:mm"
                                    ).fromNow()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex px-8 pt-4">
                                <p className="font-regular font-nunito text-sm text-[#181818]">
                                  {item.post}
                                </p>
                              </div>
                            </div>
                          </>
                        )
                      )}

                      {/* Text Post*/}

                      {/* <div className="mb-5 bg-white pb-24">
                <div className="flex px-8 pt-4">
                  <div>
                    <img src="images/profile.png" />
                  </div>
                  <div className="flex flex-col justify-center pl-4">
                    <p className="font-nunito text-sm font-bold text-[#181818]">
                      Theresa Steward
                    </p>
                    <p className="font-regular font-nunito text-[10px] text-[#181818]">
                      iOS developer
                    </p>
                    <p className="font-regular font-nunito text-[10px] text-[#181818]">
                      time
                    </p>
                  </div>
                </div>
                <div className="flex px-8 pt-4">
                  <p className="font-regular font-nunito text-sm text-[#181818]">
                    What did the Dursleys care if Harry lost his place on the
                    House Quidditch team because he hadn’t practiced all summer?
                    What was it to the Dursleys if Harry went back to school
                    without any of his homework done? The Dursleys were what
                    wizards called Muggles (not a drop of magical blood in their
                    veins).
                  </p>
                </div>
              </div> */}
                      {/* Image post */}
                      {/* <div className="mb-5 bg-white pb-24">
                <div className="flex px-8 pt-4">
                  <div>
                    <img src="images/profile.png" />
                  </div>
                  <div className="flex flex-col justify-center pl-4">
                    <p className="font-nunito text-sm font-bold text-[#181818]">
                      Theresa Steward
                    </p>
                    <p className="font-regular font-nunito text-[10px] text-[#181818]">
                      iOS developer
                    </p>
                    <p className="font-regular font-nunito text-[10px] text-[#181818]">
                      time
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-y-4 px-8 pt-4">
                  <p className="font-regular font-nunito text-sm text-[#181818]">
                    What did the Dursleys care if Harry lost his place on the
                    House Quidditch team because he hadn’t practiced all summer?
                    What was it to the Dursleys if Harry went back to school
                    without any of his homework done? The Dursleys were what
                    wizards called Muggles (not a drop of magical blood in their
                    veins).
                  </p>
                  <img src="images/post.png" alt="" />
                </div>
              </div> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {showEditProfile && (
        <div className="fixed top-0 left-0 z-10 h-full w-full bg-[#181818] text-white">
          <p
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => {
              setShowEditProfile(!showEditProfile);
            }}
          >
            X
          </p>
          <div className="flex h-full flex-col items-center justify-center gap-y-3">
            <label>
              <p>Bio</p>
              <input
                onChange={handleBio}
                value={bio}
                type="text"
                className="block w-[400px] placeholder:text-black"
              ></input>
            </label>
            <label>
              <p>Cover Image </p>

              <input
                onChange={handleCoverUpload}
                type="file"
                className="block w-[400px]"
              ></input>
            </label>
            {coverImage && (
              <Cropper
                style={{ height: 200, width: "50%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={coverImage}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                cropBoxResizable={false}
                onInitialized={(instance) => {
                  setCropper2(instance);
                }}
                guides={true}
              />
            )}
            <div className="">
              <button
                onClick={handleCancel2}
                className="nunito mt-5 w-[200px] rounded-lg bg-red-400 py-5 text-xl font-semibold text-white"
              >
                Cancel
              </button>
            </div>
            {coverAndBioList.map((item) => (
              <button
                onClick={() => (item ? getCropData2(item) : getCropData2())}
                className="w-[400px] bg-white text-[#181818]"
              >
                Submit
              </button>
            ))}
          </div>
        </div>
      )}
      {imageUploadModal && (
        <div className="fixed top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,.6)]">
          <div className=" bg-white p-5">
            <h2 className="nunito text-primary text-xl font-semibold">
              Upload your profile
            </h2>

            {image ? (
              <div className="box mx-auto block h-28 w-28 overflow-hidden rounded-full">
                <div className="img-preview h-full w-full rounded-full" />
              </div>
            ) : (
              <picture className="mx-auto block h-28 w-28 ">
                <img src={data.photoURL} alt="" className="rounded-full" />
              </picture>
            )}
            <input
              type="file"
              className="my-5"
              onChange={handleProfileUpload}
            />
            {image && (
              <Cropper
                style={{ height: 200, width: "50%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                cropBoxResizable={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
            )}
            <div className="">
              {
                <button
                  onClick={getCropData}
                  className="nunito mt-5 mr-5 w-[200px] rounded-lg bg-green-500 py-5 text-xl font-semibold text-white"
                >
                  Update
                </button>
              }

              <button
                onClick={handleCancel}
                className="nunito mt-5 w-[200px] rounded-lg bg-red-400 py-5 text-xl font-semibold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
