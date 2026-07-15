// 학습용 자리표시자: SCR-004 메뉴 상세·옵션 선택 화면입니다.
import Header from '@/components/kiosk/Header';
import { useOrderSession } from '@/store/orderSessionStore';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function MenuDetailPage() {

    //상세페이지 menuId를 기준으로 들어오도록 연결
    const { menuId } = useParams();
    const navigate = useNavigate();

    //useOrderSession에서 아이템 추가 로직
    const addItem = useOrderSession((state) => state.addItem);



  return (
    <>
        <Header></Header>
    
    </>
  )
}
