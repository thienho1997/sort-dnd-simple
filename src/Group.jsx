import { useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Card } from './Card';
import { Gap } from './Gap';
const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    // marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',

};

const DroppableTagArea = ({onDrop,children, index})=>{
    const ref = useRef(null);
    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.TAG,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        drop(item,monitor){
            if(!monitor.didDrop())
            {
                onDrop && onDrop(item.name,item.typeTag,index)
            }
          
        }
    });
    drop(ref)
    return <div ref={ref} data-handler-id={handlerId} style={{minHeight:'100px'}}>{children}</div>
}
export const Group = ({ id, index, moveCard, members, onDrop , onDropToGap}) => {
    const ref = useRef(null);
    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            return { id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0 : 1;
    const renderCard = useCallback((card, indexC) => {
        if(card.typeCard==='card')
        return (<Card indexGroup={index} key={card.id} index={indexC} id={card.id} text={card.text} moveCard={moveCard} type={ItemTypes.CARD_MEMBER}/>);
        else return <Gap indexGroup={index}  key={card.id} index={indexC} id={card.id} onDrop={onDropToGap}/>
    }, [moveCard, onDropToGap, index]);
    drag(drop(ref));
    return (<div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
        <DroppableTagArea onDrop={onDrop} index={index}>
            {members && members.map((card, indexC)=>renderCard(card, indexC))}
        </DroppableTagArea>
		</div>);
};
