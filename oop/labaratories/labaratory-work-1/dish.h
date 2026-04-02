#pragma once

#include <string>
#include <iomanip>
#include <iostream>

class Dish
{
private:
	std::string _name;
	int			_weight;
	double		_price;

public:
	Dish()
		: _name("Dish")
		, _weight(100)
		, _price(10.0)
	{
	}

	Dish(std::string name)
		: _name(std::move(name))
		, _weight(200)
		, _price(20.0)
	{
	}

	Dish(std::string name, int weight, double price)
		: _name(std::move(name))
		, _weight(weight)
		, _price(price)
	{
	}

	std::string GetName()	const;
	int			GetWeight() const;
	double		GetPrice()	const;

	void SetName(std::string name);
	void SetWeight(int weight);
	void SetPrice(double price);

	virtual void   DisplayInfo() = 0;
	virtual double CalcFullPrice() = 0;
};
