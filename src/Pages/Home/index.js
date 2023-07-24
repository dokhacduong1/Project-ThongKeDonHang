import { Card} from "antd";
import "./Home.scss";
import { auth } from "../../Config/Firebase";


function Home() {
 
  return (
    <>
      <Card className="home">
        <div className="home__welcome">
          <div className="home__welcome-header">
            <h2>Chào Mừng Bạn Đến Với Trang Thống Kê Số Liệu Bán Hàng</h2>
          </div>
        </div>
      </Card>
    </>
  );
}
export default Home;
