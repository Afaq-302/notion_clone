import React, { useState, useCallback, useEffect } from "react";
import "./styles.css";
import EditableBlock from "./editableBlock";
import uid from "./utils/uid";
import { setCaretToEnd } from "./utils/caretHelpers";
import axios from "axios";

const initialBlock = { id: uid(), html: "", tag: "p" };

function EditablePage() {
  const [blocks, setBlocks] = useState([initialBlock]);
  const [items, setItems] = useState([]);

  const updatePageHandler = useCallback(
    (updatedBlock) => {
      setBlocks((prevBlocks) => {
        const index = prevBlocks.findIndex((b) => b.id === updatedBlock.id);
        if (index !== -1) {
          const updatedBlocks = [...prevBlocks];
          updatedBlocks[index] = {
            ...updatedBlocks[index],
            tag: updatedBlock.tag,
            html: updatedBlock.html,
          };
          return updatedBlocks;
        }
        return prevBlocks;
      });
    },
    []
  );

  const addBlockHandler = useCallback(
    (currentBlock) => {
      setBlocks((prevBlocks) => {
        const newBlock = { id: uid(), html: "", tag: "p" };
        const index = prevBlocks.findIndex((b) => b.id === currentBlock.id);
        if (index !== -1) {
          const updatedBlocks = [...prevBlocks];
          updatedBlocks.splice(index + 1, 0, newBlock);
          return updatedBlocks;
        }
        return prevBlocks;
      });
      setTimeout(() => {
        if (currentBlock.ref && currentBlock.ref.nextElementSibling) {
          currentBlock.ref.nextElementSibling.focus();
        }
      }, 10);
    },
    []
  );

  const deleteBlockHandler = useCallback(
    (currentBlock) => {
      setBlocks((prevBlocks) => {
        const previousBlock =
          currentBlock.ref && currentBlock.ref.previousElementSibling;
        if (previousBlock) {
          const index = prevBlocks.findIndex((b) => b.id === currentBlock.id);
          if (index !== -1) {
            const updatedBlocks = [...prevBlocks];
            updatedBlocks.splice(index, 1);
            setTimeout(() => {
              setCaretToEnd(previousBlock);
              previousBlock.focus();
            });
            return updatedBlocks;
          }
        }
        return prevBlocks;
      });
    },
    []
  );

  // GET REQUEST
  // useEffect(() => {
  //   const fetchItems = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:1337/api/blocks");
  //       setItems(response.data.data);
  //       // console.log('items', response.data.data)
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchItems();
  // }, []);

  // const items = [
  //   { id: 1, tag: "p", html: "First item" },
  //   { id: 2, tag: "h2", html: "Second item" },
  // ];

  return (
    <div className="Page">
      {/* {items.map((item) => (
        <EditableBlock
          key={item.id}
          id={item.id}
          tag={item.attributes.tag}
          html={item.attributes.html}
          updatePage={updatePageHandler}
          addBlock={addBlockHandler}
          deleteBlock={deleteBlockHandler}
        />
      ))} */}
      {blocks.map((block) => (
        <EditableBlock
          key={block.id}
          id={block.id}
          tag={block.tag}
          html={block.html}
          updatePage={updatePageHandler}
          addBlock={addBlockHandler}
          deleteBlock={deleteBlockHandler}
        />
      ))}
    </div>
  );
}

export default EditablePage;
