import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  update,
} from "firebase/database";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  ref as sref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { useSelector } from "react-redux";

const Experience = () => {
  const storage = getStorage();
  const db = getDatabase();
  let [showExperienceEdit, setShowExperienceEdit] = useState(false);
  let [showAddExperience, setShowAddExperience] = useState(false);
  let [heading, setHeading] = useState("");
  let [desc, setDesc] = useState("");
  let [experienceList, setExperienceList] = useState([]);

  let [experienceImage, setExperienceImage] = useState("");

  const [image, setImage] = useState();
  const [image2, setImage2] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [cropData2, setCropData2] = useState("#");
  const [cropper2, setCropper2] = useState();

  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let handleExperienceEdit = () => {
    setShowExperienceEdit(true);
  };
  let handleHeading = (e) => {
    setHeading(e.target.value);
  };
  let handleDesc = (e) => {
    setDesc(e.target.value);
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
      setExperienceImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  let handleCancel = () => {
    setShowExperienceEdit(false);
    setExperienceImage("");
    setCropData("#");
    setCropper("");
    setCropData2("#");
    setCropper2("");
  };
  const getCropData = (item) => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());

      const storageRef2 = sref(storage, `experienceImage${Math.random()}`);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef2, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef2).then((downloadURL) => {
          update(ref(db, "experience/" + item.key), {
            image: downloadURL,
            heading: heading,
            desc: desc,
          }).then(() => {
            setShowExperienceEdit(!showExperienceEdit);
            setExperienceImage("");
            setCropData("#");
            setCropper("");
          });
        });
      });
    }
  };
  const getCropData2 = () => {
    if (typeof cropper2 !== "undefined") {
      setCropData2(cropper2.getCroppedCanvas().toDataURL());

      const storageRef2 = sref(storage, `experienceImage${Math.random()}`);
      const message4 = cropper2.getCroppedCanvas().toDataURL();
      uploadString(storageRef2, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef2).then((downloadURL) => {
          set(push(ref(db, "experience")), {
            whoLoginid: data.uid,
            image: downloadURL,
            heading: heading,
            desc: desc,
          }).then(() => {
            setShowAddExperience(!showAddExperience);
            setExperienceImage("");
            setCropData2("#");
            setCropper2("");
          });
        });
      });
    }
  };
  let handleAddExperience = () => {
    setShowAddExperience(true);
  };

  useEffect(() => {
    const experience = ref(db, "experience/");
    onValue(experience, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), key: item.key });
      });
      setExperienceList(arr);
    });
  }, []);
  return (
    <>
      <div className="mb-10 mt-5  bg-white p-8">
        <div className="relative">
          <h4 className="mb-2.5 font-nunito text-lg font-bold text-[#181818]">
            Experience
          </h4>
          <p
            className="absolute top-0 right-0 mb-2.5 font-nunito text-base font-medium text-[#181818]"
            onClick={handleAddExperience}
          >
            Add Experience
          </p>
          {experienceList.map((item) => (
            <div className="relative mt-6 flex gap-x-4">
              <div className="absolute right-0 top-0">
                <BiEdit onClick={() => handleExperienceEdit(item)} />
              </div>
              <div className="">
                <img src={item.image} alt="" />
              </div>
              <div>
                <h3 className="font-nunito text-sm font-medium text-[#181818]">
                  {item.heading}
                </h3>
                <p className="font-nunito text-[10px] font-normal text-[#181818]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showExperienceEdit && (
        <div className="fixed top-0 left-0 z-10 h-full w-full bg-[#181818] text-white">
          <p
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => {
              setShowExperienceEdit(false);
            }}
          >
            X
          </p>
          <div className="flex h-full flex-col items-center justify-center gap-y-3">
            <label>
              <p>heading</p>
              <input
                onChange={handleHeading}
                value={heading}
                type="text"
                className="block w-[400px] placeholder:text-black"
              ></input>
            </label>
            <label>
              <p>Description</p>
              <input
                onChange={handleDesc}
                value={desc}
                type="text"
                className="block w-[400px] placeholder:text-black"
              ></input>
            </label>
            <label>
              <p>Experience Image </p>

              <input
                onChange={handleCoverUpload}
                type="file"
                className="block w-[400px]"
              ></input>
            </label>
            {experienceImage && (
              <Cropper
                style={{ height: 200, width: "50%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={experienceImage}
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
              <button
                onClick={handleCancel}
                className="nunito mt-5 w-[200px] rounded-lg bg-red-400 py-5 text-xl font-semibold text-white"
              >
                Cancel
              </button>
            </div>
            {experienceList.map((item) => (
              <button
                onClick={() => getCropData(item)}
                className="w-[400px] bg-white text-[#181818]"
              >
                Submit
              </button>
            ))}
          </div>
        </div>
      )}
      {showAddExperience && (
        <div className="fixed top-0 left-0 z-10 h-full w-full bg-[#181818] text-white">
          <p
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => {
              setShowAddExperience(false);
            }}
          >
            X
          </p>
          <div className="flex h-full flex-col items-center justify-center gap-y-3">
            <label>
              <p>heading</p>
              <input
                onChange={handleHeading}
                value={heading}
                type="text"
                className="block w-[400px] placeholder:text-black"
              ></input>
            </label>
            <label>
              <p>Description</p>
              <input
                onChange={handleDesc}
                value={desc}
                type="text"
                className="block w-[400px] placeholder:text-black"
              ></input>
            </label>
            <label>
              <p>Experience Image </p>

              <input
                onChange={handleCoverUpload}
                type="file"
                className="block w-[400px]"
              ></input>
            </label>
            {experienceImage && (
              <Cropper
                style={{ height: 200, width: "50%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={experienceImage}
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
                onClick={handleCancel}
                className="nunito mt-5 w-[200px] rounded-lg bg-red-400 py-5 text-xl font-semibold text-white"
              >
                Cancel
              </button>
            </div>
            <button
              onClick={getCropData2}
              className="w-[300px] bg-white text-[#181818]"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Experience;
