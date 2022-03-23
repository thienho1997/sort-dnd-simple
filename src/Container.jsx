import { useState, useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Card } from './Card';
import update from 'immutability-helper';
import { Group } from './Group';
import { Tag } from './Tag';
import { Gap } from './Gap';
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
            {id: 0, typeCard:'gap'},
            {
                id: 1,
                text: 'Write a cool JS library',
                typeCard: 'card'
            },
            {
                id: 2,
                typeCard:'gap',
            },
            {
                id: 3,
                text: 'Write README',
                typeCard: 'card'
            },
            {
                id: 20,
                typeCard:'gap',
            },
            {
                id: 9,
                typeCard:'group',
                members:[
                    {
                        id: 15,
                        typeCard:'gap',
                    },
                {
                    id: 10,
                    text: 'Write README',
                    typeCard: 'card'
                },
                {
                    id: 11,
                    typeCard:'gap',
                },
                {
                    id: 12,
                    text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
                    typeCard: 'card'
                },
                {
                    id: 13,
                    typeCard:'gap',
                },
                ]
            },
            {
                id: 6,
                typeCard:'gap',
            },
            {
                id: 4,
                text: 'Create some examples',
                typeCard: 'card'
            },
            {
                id: 7,
                typeCard:'gap',
            }
      
        ]);
        const moveCard = useCallback((dragIndex, hoverIndex, indexGroup) => {
            // debugger
            const newList = [...cards];
            if(indexGroup){
               
                const newGroup = {...newList[indexGroup]};
                let newMembers = [...newGroup.members];
                // newMembers = update(newMembers, {
                //     $splice: [
                //         [dragIndex, 1],
                //         [hoverIndex, 0, newMembers[dragIndex]],
                //     ],
                // })
                const temp = newMembers[dragIndex];
                newMembers[dragIndex] = newMembers[hoverIndex];
                newMembers[hoverIndex] = temp;
                newGroup.members = newMembers;
                newList[indexGroup] = newGroup;
                setCards(newList)
            }
            else{
                const temp = newList[dragIndex];
                newList[dragIndex] = newList[hoverIndex];
                newList[hoverIndex] = temp;
                setCards(newList);
                // setCards((prevCards) => update(prevCards, {
                //     $splice: [
                //         [dragIndex, 1],
                //         [hoverIndex, 0, prevCards[dragIndex]],
                //     ],
                // }));
            }
           
        }, [cards, setCards]);
        const onDropToGap = (name, typeTag, indexGap ,indexGroup)=>{
            // debugger
            const newList = [...cards];
            if(!indexGroup){
                if(typeTag === 'Tag_Group'){
                    newList.splice(indexGap+1,0,{id:uuid(), typeCard:'group',members:[]}, {id:uuid(), typeCard:'gap'})
                    
                }
                else{
                    newList.splice(indexGap+1,0,{id:uuid(), typeCard:'card', text:name}, {id:uuid(), typeCard:'gap'})
                } 
            }
            else{
                if(typeTag === 'Tag_Group'){
                    
                }
                else{
                    const newGroup = {...newList[indexGroup]}
                    const newMembers = [...newGroup.members]
                    newMembers.splice(indexGap+1,0,{id:uuid(), typeCard:'card', text:name}, {id:uuid(), typeCard:'gap'})
                    newGroup.members = newMembers;
                    newList[indexGroup] = newGroup;
                }
            }
            setCards(newList)
        }
        const onDrop = (name, typeTag, indexGroup)=>{
        //    debugger
             const newList = [...cards];
            if(indexGroup){
                const newGroup = {...newList[indexGroup]}
                const newMembers = [...newGroup.members]
                if(typeTag==='Tag_Group'){
                   
                }
                else{
                    if(newMembers.length===0){
                        newMembers.push({id:uuid(), typeCard:'gap'},{text:name, id: uuid(), typeCard:'card'}, {id:uuid(), typeCard:'gap'});
                    }      
                }
               
                newGroup.members = newMembers;
                newList[indexGroup] = newGroup;
            }
            // else{
            //     if(typeTag==='Tag_Group'){
            //         newList.push({id: uuid(), members:[]});
            //     }
            //     else{
            //         newList.push({text:name, id: uuid()});
            //     }
            // }
            setCards(newList)
        }
        const renderCard = useCallback((card, index) => {
            if(card.typeCard==='card')
            return (<Card key={card.id} index={index} id={card.id} text={card.text} moveCard={moveCard}/>);
            else if (card.typeCard === 'group')
            return <Group key={card.id} index={index} id={card.id} members={card.members} moveCard={moveCard} onDrop={onDrop} onDropToGap={onDropToGap}/>
            else return <Gap key={card.id} index={index} id={card.id} onDrop={onDropToGap}/>
        }, [moveCard, onDropToGap, onDrop]);

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
