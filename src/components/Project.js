import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  update,
} from "firebase/database";
import {
  getStorage,
  ref as sref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";

const Project = () => {
  const storage = getStorage();
  const db = getDatabase();
  let [showAddProject, setShowAddProject] = useState(false);
  let [showEditProject, setShowEditProject] = useState(false);
  let [projectName, setProjectName] = useState(false);
  let [projectField, setFieldName] = useState(false);
  let [projectList, setProjectList] = useState([]);

  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [cropData2, setCropData2] = useState("#");
  const [cropper2, setCropper2] = useState();

  let data = useSelector((state) => state.userLoginInfo.userInfo);

  let handleAddProject = () => {
    setShowAddProject(!showAddProject);
  };

  const handleProjectImage = (e) => {
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
  const getCropData = (item) => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());

      const storageRef = sref(storage, `ProjectImage${Math.random()}`);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          set(push(ref(db, "projects")), {
            whoAddProject: data.uid,
            image: downloadURL,
            name: projectName,
            field: projectField,
          }).then(() => {
            setShowAddProject(!showAddProject);
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

      const storageRef2 = sref(storage, `projectImage${Math.random()}`);
      const message4 = cropper2.getCroppedCanvas().toDataURL();
      uploadString(storageRef2, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef2).then((downloadURL) => {
          update(ref(db, "projects/" + item.key), {
            image: downloadURL,
            name: projectName,
            field: projectField,
          }).then(() => {
            setShowEditProject(!showEditProject);
            image("");
            setCropData2("#");
            setCropper2("");
          });
        });
      });
    }
  };
  let handleCancel = () => {
    setShowAddProject(false);
    setImage("");
    setCropData("#");
    setCropper("");
  };
  let handleProjectName = (e) => {
    setProjectName(e.target.value);
  };
  let handleProjectField = (e) => {
    setFieldName(e.target.value);
  };
  useEffect(() => {
    const coverAndBio = ref(db, "projects/");
    onValue(coverAndBio, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), key: item.key });
      });
      setProjectList(arr);
    });
  }, []);
  let handleEditProject = () => {
    setShowEditProject(true);
  };
  return (
    <>
      <div className="mb-10 mt-5  bg-white p-8">
        <div className="relative">
          <h4 className="mb-2.5 font-nunito text-lg font-bold text-[#181818]">
            Projects
          </h4>
          <p
            className="absolute top-0 right-0 mb-2.5 font-nunito text-base font-medium text-[#181818]"
            onClick={handleAddProject}
          >
            Add Project
          </p>
        </div>

        <div className="flex flex-wrap gap-x-5 overflow-y-scroll">
          {projectList.map((item) => (
            <div className="mb-16 w-[30%]">
              <img src={item.image} alt="" className="mb-4" />
              <p className="font-nunito text-sm font-medium text-[#181818]">
                {item.name}
              </p>
              <p className="font-nunito text-[10px] font-light text-[#181818]">
                {item.field}
              </p>
              <BiEdit onClick={handleEditProject} />
            </div>
          ))}
        </div>
      </div>
      {showAddProject && (
        <div className="fixed top-0 left-0 z-10 h-full w-full bg-[#181818] text-white">
          <p
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => {
              setShowAddProject(!showAddProject);
            }}
          >
            X
          </p>
          <div className="flex h-full flex-col items-center justify-center gap-y-3">
            <label>
              <p>Project Name</p>
              <input
                onChange={handleProjectName}
                type="text"
                className="block w-[400px]"
              ></input>
            </label>
            <label>
              <p>Field</p>
              <input
                onChange={handleProjectField}
                type="text"
                className="block w-[400px]"
              ></input>
            </label>
            <label>
              <p>Project Image </p>
              <input
                onChange={handleProjectImage}
                type="file"
                className="block w-[400px]"
              ></input>
            </label>
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
              <button
                onClick={handleCancel}
                className="nunito mt-5 w-[200px] rounded-lg bg-red-400 py-5 text-xl font-semibold text-white"
              >
                Cancel
              </button>
            </div>
            <button
              onClick={getCropData}
              className="w-[400px] bg-white text-[#181818]"
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {showEditProject && (
        <div className="fixed top-0 left-0 z-10 h-full w-full bg-[#181818] text-white">
          <p
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => {
              setShowEditProject(!showEditProject);
            }}
          >
            X
          </p>
          <div className="flex h-full flex-col items-center justify-center gap-y-3">
            <label>
              <p>Project Name</p>
              <input
                onChange={handleProjectName}
                type="text"
                className="block w-[400px]"
              ></input>
            </label>
            <label>
              <p>Field</p>
              <input
                onChange={handleProjectField}
                type="text"
                className="block w-[400px]"
              ></input>
            </label>
            <label>
              <p>Project Image </p>
              <input
                onChange={handleProjectImage}
                type="file"
                className="block w-[400px]"
              ></input>
            </label>
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
            {projectList.map((item) => (
              <button
                onClick={() => getCropData2(item)}
                className="w-[400px] bg-white text-[#181818]"
              >
                Submit
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Project;
