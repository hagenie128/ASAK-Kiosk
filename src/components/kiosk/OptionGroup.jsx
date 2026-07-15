//2) OptionGroup (그룹 안의 옵션 선택 카드들의 집합 그룹 ui )
// json menuOptions -> data ->  optionGroupId

import React from 'react'
import OptionItem from './OptionItem';

export default function OptionGroup({ group, selectedValue, onSelectItem }) {

    const { name, selectType, minSelect, maxSelect, isRequired, items } = group;

    const isSingleSelect = selectType === "SINGLE";

    //현재 렌더링 중인 옵션(optionItemId)이 선택된 상태인지 아닌지 확인하는 함수
     const isItemSelected = (optionItemId) => {
        //싱글
       if (isSingleSelect) return selectedValue === optionItemId;
       //멀티플
       return (selectedValue ?? []).includes(optionItemId);
     };

  return (
    <>
      <div>
        {/* {name} 인라인요소인 span으로 사용 <h></h>블럭이라 x */}
        <span>{name}</span>
        {isRequired && <span>필수</span>}
        <span>
          {isRequired ? `최소 ${minSelect}개 선택` : `최대 ${maxSelect}개 선택`}
        </span>
        {/* 옵션 선택 item map영역 */}
        <ul>
            {
                group.map((item, index)=>{
                    <li>
                        <OptionItem key={item.optionItemId}
                                    item={item}
                                    isSingleSelect={isSingleSelect}
                                    isSelected={isItemSelected(item.optionItemId)}
                                    onSelect={() => onSelectItem(item.optionItemId)}
                        ></OptionItem>


                    </li>

                })
            }


        </ul>


      </div>
    </>
  );
}
