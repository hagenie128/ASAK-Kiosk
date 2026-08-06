// SCR-003 / Menu List — Figma 134:7792
// 나연이 흐름: 카테고리·메뉴 선택·OrderList·장바구니 합계.
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/common/Header";
import CategoryTabs from "@/components/kiosk/CategoryTabs";
import MenuCard from "@/components/kiosk/MenuCard";
import OrderList from "@/components/kiosk/OrderList";
import MenuListFooter from "@/components/kiosk/MenuListFooter";
import { useCartStore } from "@/store/cartStore";
import { getCartTotalQuantity } from "@/utils/quantityLimits";
import { calculateCartTotal } from "@/utils/priceCalculation";
import { getCategories } from "@/api/category";
import { getMenus } from "@/api/menu";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";

export default function MenuListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 카테고리 api 연결 작업
  const [categories, setCategories] = useState([]);
  const [categoryError , setCategoryError ] = useState(null);
  const [isCategoryLoading , setIsCategoryLoading] = useState(true);
  
  //메뉴 api 연결 작업
  const [menus , setMenus] = useState([]);
  const [menuError , setMenuError] = useState(null);
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const [selectedMenuId , setSelectedMenuId] = useState(null);

  useEffect(()=>{

    const fetchCategories = async () =>{

      try{
          setIsCategoryLoading(true);
          setCategoryError(null);

          const categoryData = await getCategories();
          setCategories(categoryData);

      }catch(error){
        setCategoryError(error)
      }finally{
        setIsCategoryLoading(false);
      }
    };

    fetchCategories();

  },[])

  const categoryParams = Number(searchParams.get("category"))

  const selectedCategoryId =
    categories.some((category)=> category.categoryId === categoryParams)? categoryParams : categories[0]?.categoryId;

  // 선택된 카테고리가 달라질 때 메뉴 api를 호출
  useEffect(()=>{

    if(!selectedCategoryId){
      setMenus([]);
      return;
    }

    let ignore = false;

    const fetchMenus = async ()=>{

      try{
        setIsMenuLoading(true);
        setMenuError(null);

        const menuData = await getMenus(selectedCategoryId);
        const menuList = Array.isArray(menuData) ? menuData : (menuData?.menus ?? []);

        if(!ignore){
          setMenus(
            menuList.filter((menu) => menu.categoryId === selectedCategoryId),
          );
        }

      }catch(error){
        if(!ignore){
          setMenuError(error)
          setMenus([]);
        }
      }finally{
        if(!ignore){
          setIsMenuLoading(false);
        }
      }
    }
    fetchMenus();

    return () => {
      ignore = true;
    };

  },[selectedCategoryId]);

  //url의 category 생성되는 함수
  const handleSelectCategory = (categoryId) => {
    setSearchParams({ category: String(categoryId) });
  };
  
  const handleSelectMenu = (menuId) => {
    setSelectedMenuId(menuId);
    navigate(`/menu/${menuId}?category=${selectedCategoryId}`);
  };

  const items = useCartStore((state) => state.items);
  const itemCount = getCartTotalQuantity(items);
  const totalAmount = calculateCartTotal(items);




  const handleCheckout = () => {
    navigate("/cart");
  };

  return (
    <div className="menu-list-page">
      <Header />

      {isCategoryLoading ? (
        <p className="category_dbLoding">카테고리를 불러오는 중입니다.</p>
      ) : categoryError ? (
        <p className="category_dbError">{categoryError.message || "카테고리를 불러오지 못했습니다."}</p>
      ) : categories.length === 0 ? (
        <p className="category_dbempty">표시할 카테고리가 없습니다.</p>
      ) : (
        <CategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />
      )}

      <main className="menu-grid-scroll-area">
        {isMenuLoading ? (
          <LoadingSpinner/>
        ) : menuError ? (
          <ErrorMessage/>
        ) : menus.length === 0 ? (
          <EmptyState/>
        ) : (
          <ul className="menuGrid">
            {menus.map((menu) => (
              <li key={menu.menuId}>
                <MenuCard
                  menu={menu}
                  isSelected={selectedMenuId === menu.menuId}
                  onSelect={handleSelectMenu}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <OrderList />

      <MenuListFooter
        itemCount={itemCount}
        totalAmount={totalAmount}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
