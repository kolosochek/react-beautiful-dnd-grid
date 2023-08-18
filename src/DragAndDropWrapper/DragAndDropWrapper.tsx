import React, { ReactElement } from "react";
import { Draggable, DraggableProvided, DraggableStateSnapshot, DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot, DropResult } from "react-beautiful-dnd";
import { ListManagerItem } from "./ListManagerItem";
import hash from "object-hash";
import {Grid} from '@mui/material';

interface Location {
  id: string;
  index: number;
}

export interface DragAndDropResult {
  source: Location;
  destination: Location;
}

export interface Chunk {
  id: string;
  items: any[];
}

export interface Props {
  chunks: Chunk[];
  direction: "horizontal" | "vertical";
  placeholder: ReactNode,
  render(item: any): ReactElement<{}>;
  onDragEnd(result: DragAndDropResult): void;
}

const horizontalStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start"
};

export const DragAndDropWrapper: React.StatelessComponent<Props> = ({
  onDragEnd,
  chunks,
    placeholder,
  direction,
  render
}: Props) => {
  return (
    <DragDropContext onDragEnd={mapAndInvoke(onDragEnd)}>
      {chunks.map(({ id: droppableId, items }: Chunk, chunkIndex) => (
        <Droppable  key={droppableId} droppableId={droppableId} direction={direction}>
          {(provided: DroppableProvided, _: DroppableStateSnapshot) => (
            <Grid
                container
                direction="row"
                columnSpacing={2}
                sx={{
                  mb: 2,
                  '& > .MuiGrid-root': {
                    minWidth: '340px',
                  },
                }}
              ref={provided.innerRef}
              style={direction === "horizontal" ? horizontalStyle : undefined}
              {...provided.droppableProps}
            >
              {items.map((item: any, index: number) => (
                    <ListManagerItem key={hash(item)} item={item} index={index} render={render} />
              ))}
            </Grid>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

function mapAndInvoke(onDragEnd: (result: DragAndDropResult) => void) {
  return function({ source, destination }: DropResult): void {
    if (destination !== undefined && destination !== null) {
      const result: DragAndDropResult = {
        source: {
          id: source.droppableId,
          index: source.index
        },
        destination: {
          id: destination.droppableId,
          index: destination.index
        }
      };
      onDragEnd(result);
    }
  };
}
