import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};
export const Tag = ({ id, name, index , type = ItemTypes.TAG, typeTag}) => {
    const ref = useRef(null);

    const [{ isDragging,handlerId }, drag] = useDrag({
        type: type,
        item: () => {
            return { id, index, name, typeTag };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(), 
            handlerId: monitor.getHandlerId(),
        }),
    });
    const opacity = isDragging ? 0 : 1;
    drag(ref);
    return (<div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
			{name}
		</div>);
};
