import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { BsImage, BsThreeDots } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref as sref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import moment from "moment/moment";

const Home = () => {
  const db = getDatabase();
  const auth = getAuth();
  const storage = getStorage();
  let navigate = useNavigate();
  let [imageUploadModal, setImageUploadModal] = useState(false);
  let [post, setPost] = useState("");
  let [postList, setPostList] = useState([]);

  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let handlePost = (e) => {
    setPost(e.target.value);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());

      const storageRef = sref(storage, "chatImage" + Math.random());
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          set(push(ref(db, "post")), {
            whoPostId: data.uid,
            whoPostName: data.displayName,
            post: post,
            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()}   ${new Date().getHours()} ${new Date().getMinutes()}`,
            image: downloadURL,
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

  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  }, []);

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
  let handleCancel = () => {
    setImageUploadModal(false);
    setImage("");
    setCropData("#");
    setCropper("");
  };
  let handleImageUpload = () => {
    setImageUploadModal(true);
  };
  let handlePublish = () => {
    set(push(ref(db, "post")), {
      whoPostId: data.uid,
      whoPostName: data.displayName,
      post: post,
      date: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}   ${new Date().getHours()} ${new Date().getMinutes()}`,
    });
  };

  useEffect(() => {
    const posts = ref(db, "post/");
    onValue(posts, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val());
      });
      setPostList(arr);
    });
  }, []);

  return (
    <div className="bg-[#F7F9FB]">
      <div>
        <img src="images/logo.png" alt="logo" />
      </div>
      <Container>
        <div className="flex gap-x-10">
          <div className="w-[850px]">
            <div className="mb-9 mt-10 bg-white">
              <div>
                <p className="border-b border-solid border-[#f4f4f4] p-5 font-nunito text-xs font-medium uppercase">
                  New post
                </p>
              </div>
              <div className="relative">
                <input
                  onChange={handlePost}
                  value={post}
                  className="w-full p-7 pr-[108px]"
                  placeholder="What’s on your mind?"
                ></input>
                <BsImage
                  onClick={handleImageUpload}
                  className="absolute top-8 right-10 text-[rgba(0,0,0,0.15)]"
                />
                <div
                  onClick={handlePublish}
                  className="absolute top-8 right-4 text-[#0E6795]"
                >
                  <FaTelegramPlane />
                </div>
              </div>
            </div>

            <div className="">
              {postList.map((item) =>
                item.image ? (
                  <>
                    <div className="mb-5 bg-white pb-24">
                      <div className="flex justify-end border-b border-solid border-[#f4f4f4] py-6">
                        <BsThreeDots className=" mr-5" />
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
                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
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
                      <div className="flex justify-end border-b border-solid border-[#f4f4f4] py-6">
                        <BsThreeDots className=" mr-5" />
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
                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
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
          </div>
          <div className="mt-10 w-[250px]">
            <div>
              <Link to="/profile">
                <div className="relative">
                  <img src="images/cover.png" />
                  <img
                    src="images/profile2.png"
                    className="absolute  right-5 translate-x-[-50%] translate-y-[-50%]"
                    alt=""
                  />
                </div>
                <div className="mb-4 bg-white px-6 pt-16 pb-6">
                  <p className="pb-2 text-center font-nunito text-sm font-bold text-[#181818]">
                    {data.displayName}
                  </p>
                  <p className="font-regular pb-2 text-center font-nunito text-[10px] text-[#181818]">
                    Freelance UX/UI designer, 80+ projects in web design, mobile
                    apps (iOS & android) and creative projects. Open to offers.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Container>
      {imageUploadModal && (
        <div className="fixed top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,.6)]">
          <div className=" bg-white p-5">
            <h2 className="nunito text-primary text-xl font-semibold">
              Upload your profile
            </h2>

            {image ? (
              <div className="box mx-auto block h-28 w-28 overflow-hidden">
                <div className="img-preview h-full w-full rounded-full" />
              </div>
            ) : (
              <picture className="mx-auto block h-28 w-28 ">
                <img src={image} alt="" className="rounded-full" />
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
            <p className="font-regular font-nunito text-sm text-[#181818]">
              {post}
            </p>
            <div className="">
              {
                <button
                  onClick={getCropData}
                  className="nunito mt-5 mr-5 w-[200px] rounded-lg bg-green-500 py-5 text-xl font-semibold text-white"
                >
                  Post
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
    </div>
  );
};

export default Home;
