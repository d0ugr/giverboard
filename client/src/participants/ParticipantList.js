import React from "react";
// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import "./ParticipantList.scss";

import ParticipantListItem from "./ParticipantListItem";



function ParticipantList(props) {

  // const [ list, setList ] = useState([]);

  // const reorder = (list, startIndex, endIndex) => {
  //   const result = Array.from(list);
  //   const [removed] = result.splice(startIndex, 1);
  //   result.splice(endIndex, 0, removed);

  //   return result;
  // };

  // const onDragEnd = (result) => {
  //   // dropped outside the list
  //   if (!result.destination) {
  //     return;
  //   }

  //   const items = reorder(
  //     this.state.items,
  //     result.source.index,
  //     result.destination.index
  //   );

  //   this.setState({
  //     items
  //   });
  // };

  return (
    <ul className="participant-list">
      {Object.keys(props.participants).map((key, index) =>
        <ParticipantListItem
          key={index}
          className={key === props.clientId ? "highlight" : null}
          currentTurn={key === props.currentParticipantId}
          name={props.participants[key].name}
          // name={`${props.participants[key].name}${key === props.clientId ? " (You)" : ""}`}
        />
      )}
    </ul>

    // <DragDropContext onDragEnd={onDragEnd}>
    //   <Droppable droppableId="droppable">
    //     {(provided, snapshot) => (
    //         <div
    //           {...provided.droppableProps}
    //           ref={provided.innerRef}
    //           // style={getListStyle(snapshot.isDraggingOver)}
    //         >
    //           {Object.keys(props.participants).map((key, index) => (
    //             <Draggable key={index} draggableId={key} index={index}>
    //               {(provided, snapshot) => (
    //                 <ParticipantListItem
    //                   ref={provided.innerRef}
    //                   {...provided.draggableProps}
    //                   {...provided.dragHandleProps}
    //                   // style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
    //                   // key={index}
    //                   className={key === props.clientId ? "highlight" : null}
    //                   name={props.participants[key].name}
    //                   // name={`${props.participants[key].name}${key === props.clientId ? " (You)" : ""}`}
    //                 />

    //                 // <div
    //                 //   ref={provided.innerRef}
    //                 //   {...provided.draggableProps}
    //                 //   {...provided.dragHandleProps}
    //                 //   style={getItemStyle(
    //                 //     snapshot.isDragging,
    //                 //     provided.draggableProps.style
    //                 //   )}
    //                 // >
    //                 //   {item.content}
    //                 // </div>
    //               )}
    //             </Draggable>
    //           ))}
    //           {provided.placeholder}
    //         </div>
    //       )}
    //   </Droppable>
    // </DragDropContext>
  );

}

export default ParticipantList;
