import { faker } from "@faker-js/faker";

const mockData = new Array(100).fill(0).map(() => ({
    title: faker.animal.cetacean(),
    id: crypto.randomUUID(),
}))

export default function ProjectOverviewPage() {
    return (
        <div>
            Hallo Welt
        </div>
    )
}