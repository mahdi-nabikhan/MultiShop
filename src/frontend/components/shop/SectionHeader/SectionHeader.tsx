import "./SectionHeader.css";

interface SectionHeaderProps {

    title: string;

    description: string;

}

export default function SectionHeader({

    title,

    description,

}: SectionHeaderProps) {

    return (

        <section className="section-header">

            <span className="section-badge">

                Explore

            </span>

            <h2>

                {title}

            </h2>

            <p>

                {description}

            </p>

        </section>

    );

}