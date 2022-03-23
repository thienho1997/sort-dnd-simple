import { useState, useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Card } from './Card';
import update from 'immutability-helper';
import { Group } from './Group';
import { Tag } from './Tag';
import { ItemTypes } from './ItemTypes';
import uuid from 'react-uuid'
const style = {
    width: 400,
};
const dataTags = [  {
    id: 2,
    name: 'Make it generic enough',
    type: 'Tag'
},
{
    id: 3,
    name: 'Write README',
    type: 'Tag'
},
{
    id: 7,
    name:'Group',
    type:'Tag_Group'
},
{
    id: 4,
    name: 'Create some examples',
    type: 'Tag'
},
{
    id: 5,
    name: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
    type: 'Tag'
},
{
    id: 6,
    name: '???',
    type: 'Tag'
}
]

const LeftSide = ({onDrop, children})=>{
    const ref = useRef(null);
    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.TAG,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        drop(item,monitor){
            if(!monitor.didDrop()){
                onDrop && onDrop(item.name, item.typeTag)
            }
        }
    });
    drop(ref)
    return <div ref={ref} data-handler-id={handlerId} style={style}>{children}</div>
}
export const Container = () => {
    {
        const [cards, setCards] = useState([
            {
                id: 1,
                text: 'Write a cool JS library',
            },
            {
                id: 2,
                text: 'Make it generic enough',
            },
            {
                id: 3,
                text: 'Write README',
            },
            {
                id: 9,
                members:[
                {
                    id: 10,
                    text: 'Write README',
                },
                {
                    id: 11,
                    text: 'Create some examples',
                },
                {
                    id: 12,
                    text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
                },
                {
                    id: 13,
                    text: '???',
                },
                ]
            },
            {
                id: 4,
                text: 'Create some examples',
            },
            {
                id: 5,
                text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
            },
            {
                id: 6,
                text: '???',
            },
            {
                id: 7,
                text: 'PROFIT',
            },
            {
                id: 8,
                members:[
                {
                    id: 10,
                    text: 'Write README',
                },
                {
                    id: 11,
                    text: 'Create some examples',
                },
                {
                    id: 12,
                    text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
                },
                {
                    id: 13,
                    text: '???',
                },
                ]
            }
        ]);
        const moveCard = useCallback((dragIndex, hoverIndex, indexGroup) => {
            // debugger
            if(indexGroup){
                const newList = [...cards];
                const newGroup = {...newList[indexGroup]};
                let newMembers = [...newGroup.members];
                newMembers = update(newMembers, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, newMembers[dragIndex]],
                    ],
                })
                newGroup.members = newMembers;
                newList[indexGroup] = newGroup;
                setCards(newList)
            }
            else{
                setCards((prevCards) => update(prevCards, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevCards[dragIndex]],
                    ],
                }));
            }
           
        }, [cards, setCards]);
        const onDrop = (name, typeTag, indexGroup)=>{
           
            const newList = [...cards];
            if(indexGroup){
                const newGroup = {...newList[indexGroup]}
                const newMembers = [...newGroup.members]
                if(typeTag==='Tag_Group'){
                   
                }
                else{
                    newMembers.push({text:name, id: uuid()});
                }
               
                newGroup.members = newMembers;
                newList[indexGroup] = newGroup;
            }
            else{
                if(typeTag==='Tag_Group'){
                    newList.push({id: uuid(), members:[]});
                }
                else{
                    newList.push({text:name, id: uuid()});
                }
            }
            setCards(newList)
        }
        const renderCard = useCallback((card, index) => {
            if(!card.members)
            return (<Card key={card.id} index={index} id={card.id} text={card.text} moveCard={moveCard}/>);
            else 
            return <Group key={card.id} index={index} id={card.id} members={card.members} moveCard={moveCard} onDrop={onDrop}/>
        }, [moveCard]);

        const renderTag = useCallback((tag,index)=>{
            return <Tag key={tag.id} index={index} id={tag.id} name={tag.name} typeTag={tag.type}/>
        },[])
        
        return (<div style={{display:'flex', justifyContent:'space-between'}}>
                <LeftSide onDrop={onDrop}>
                <div>{cards.map((card, i) => renderCard(card, i))}</div>
                </LeftSide>
				
                <div style={{width:'500px'}}>
                    {dataTags.map((tag,i)=>renderTag(tag,i))}
                </div>
			</div>);
    }
};
