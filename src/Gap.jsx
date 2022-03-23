import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
const style = {
    height: '15px'
};
export const Gap = ({ id, index, onDrop , indexGroup}) => {
    const ref = useRef(null);
    const [{ handlerId, isOver }, drop] = useDrop({
        accept: ItemTypes.TAG,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
                isOver: monitor.isOver({ shallow: true })
            };
        },
        drop(item,monitor){
            // debugger
            onDrop && onDrop (item.name, item.typeTag, index, indexGroup)
        }
     
    },[indexGroup, index, onDrop]);
//    console.log('isOver', isOver)
    drop(ref);
    return (<div ref={ref} style={{ ...style, backgroundColor: isOver ? 'blue': null }} data-handler-id={handlerId}>
			
		</div>);
};
