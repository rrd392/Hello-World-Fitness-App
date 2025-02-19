const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());

// 数据库连接配置
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hello_world_fitness",
  connectTimeout: 10000
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 输入验证
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "username and password coundnt be empty" 
    });
  }

  // 直接比较明文密码（仅限开发环境）
  const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('数据库错误:', error);
      return res.status(500).json({ 
        success: false, 
        message: "服务器内部错误" 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: "username or password error" 
      });
    }

    const user = results[0];
    res.json({
      success: true,
      role: user.role,
      user: {
        id: user.id,
        username: user.username
      }
    });
  });
});

// 服务器启动
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server run at http://localhost:${PORT}`);
});