module.exports = (sequelize, DataTypes) => {
    const Komik = sequelize.define('Komik', {
        id_komik: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        judul_komik: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sinopsis_komik: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tahun_terbit_komik: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        penulis_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'komik',
        timestamps: true
    });

    Komik.associate = (models) => {
        Komik.belongsTo(models.Penulis, {
            foreignKey: 'penulis_id',
            as: 'penulis'
        });
        Komik.belongsToMany(models.Genre, {
            through: 'KomikGenre',
            foreignKey: 'komik_id',
            otherKey: 'genre_id',
            as: 'genre'
        });
    };

    return Komik;
};