import {Sequelize} from "sequelize";

const sequelize=new Sequelize(process.env.DATABASE_NAME,process.env.USER,process.env.PASSWORD,{
    dialect:"mysql",
    host:process.env.HOST
});

export default sequelize;


