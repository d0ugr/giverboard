import React from "react";
// import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
// import Divider from "@material-ui/core/Divider";

// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";



const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: "ghostwhite",
    color: "black",
  },
  listItem: {
    padding: "0 .5em",
  },
  // listItemIcon: {
  //   margin: theme.spacing(0),
  // },
}));



function ParticipantList(props) {

  const classes = useStyles();

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
    <List className={classes.list} aria-label="participant list">
      {Object.keys(props.participants).map((key, index) =>
        <ListItem className={classes.listItem} key={index}>
          <ListItemIcon>
            {index === props.currentTurn && <PlayArrowIcon/>}
          </ListItemIcon>
          <ListItemText primary={props.participants[key].name}/>
        </ListItem>
      )}
    </List>

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
