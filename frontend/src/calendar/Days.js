function Days() {
    const days = [];
    const date = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
        days.push(
            <div
                className={`flex flex-col w-12 items-center ${
                    date[i] === 'Sun'
                        ? 'text-rose-400'
                        : date[i] === 'Sat'
                        ? 'text-indigo-400'
                        : ''
                }`}
                key={i}
            >
                {date[i]}
            </div>
        );
    }

    return (
        <div className="flex flex-row w-full h-16 justify-around items-center">
            {days}
        </div>
    );
}

export default Days;
