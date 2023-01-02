import {Sequelize} from "sequelize";

const sequelize=new Sequelize("webportal-project","root","niniko",{
    dialect:"mysql"
});

export default sequelize;


