import React, { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import "./styles.css";
import SelectMenu from "./selectMenu";
import { getCaretCoordinates, setCaretToEnd } from "./utils/caretHelpers";
import axios from "axios";

const CMD_KEY = "/";

const EditableBlock = (props) => {

  const [htmlBackup, setHtmlBackup] = useState(null);
  const htmlRef = useRef(props.html || "");
  const [tag, setTag] = useState("p");
  const [previousKey, setPreviousKey] = useState("");
  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState(false);
  const [selectMenuPosition, setSelectMenuPosition] = useState({ x: null, y: null });
  const contentEditable = useRef(null);

  useEffect(() => {
    setTag(props.tag);
  }, []);

  useEffect(() => {
    const htmlChanged = htmlRef.current !== props.html;
    const tagChanged = tag !== props.tag;
    if (htmlChanged || tagChanged) {
      props.updatePage({ id: props.id, html: htmlRef.current, tag });
    }
  }, [tag, props.html, props.tag]);

  const onChangeHandler = (e) => {
    htmlRef.current = e.target.value;
  };

  const onKeyDownHandler = (e) => {
    if (e.key === CMD_KEY) {
      setHtmlBackup(htmlRef.current);
    }
    if (e.key === "Enter") {
      if (previousKey !== "Shift" && !selectMenuIsOpen) {
        if (!e.shiftKey) {
          e.preventDefault();
          props.addBlock({ id: props.id, ref: contentEditable.current });
        }
      }
      // sendBlock();
    }
    if (e.key === "Backspace" && !htmlRef.current) {
      e.preventDefault();
      props.deleteBlock({ id: props.id, ref: contentEditable.current });
    }
    setPreviousKey(e.key);
  };

  const onKeyUpHandler = (e) => {
    if (e.key === CMD_KEY) {
      openSelectMenuHandler();
    }
  };

  const openSelectMenuHandler = () => {
    const { x, y } = getCaretCoordinates();
    setSelectMenuPosition({ x, y });
    setSelectMenuIsOpen(true);
    document.addEventListener("click", closeSelectMenuHandler);
  };

  const closeSelectMenuHandler = () => {
    setHtmlBackup(null);
    setSelectMenuIsOpen(false);
    setSelectMenuPosition({ x: null, y: null });
    document.removeEventListener("click", closeSelectMenuHandler);
    contentEditable.current.focus(); 
    setCaretToEnd(contentEditable.current);
  };

  const tagSelectionHandler = (tag) => {
    setTag(tag);
    htmlRef.current = htmlBackup;
    setCaretToEnd(contentEditable.current);
    closeSelectMenuHandler();
  };


  //POST REQUEST
  // const sendBlock = async () => {
  //   try {
  //     const currentHtml = htmlRef.current;
  //     const currentTag = tag;

  //     const block = {
  //       id: props.id,
  //       attributes: {
  //         html: 'This is dummy text',
  //         tag: 'p'
  //       }
  //     };

  //     const response = await axios.post("http://localhost:1337/api/blocks", {
  //       data: { block }
  //     }, {
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     });
  //     console.log("Response:", response.data); // Optional: Handle the response
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


  return (
    <>
      {selectMenuIsOpen && (
        <SelectMenu
          position={selectMenuPosition}
          onSelect={tagSelectionHandler}
          close={closeSelectMenuHandler}
        />
      )}
      <ContentEditable
        className="Block"
        innerRef={contentEditable}
        html={htmlRef.current}
        tagName={tag}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
      />
    </>
  );
};

export default EditableBlock;