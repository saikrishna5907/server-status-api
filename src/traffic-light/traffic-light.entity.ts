import { Dashboard } from './../dashboard/dashboard.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TrafficLight {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: number

    @Column()
    created_At: Date

    @Column()
    updated_At: Date

    @ManyToMany(() => Dashboard, (dashboard) => dashboard.trafficLights, { cascade: true })
    @JoinTable()
    dashboards: Dashboard[]
}