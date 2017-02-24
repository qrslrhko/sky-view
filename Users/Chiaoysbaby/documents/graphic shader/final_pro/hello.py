

import numpy as np


class Test(object):

    def __init__(self, a, b): 

        # self.shape = 
        self.a = np.array([1,2,3])
        self.b = np.array([4,5,6])
        self.cc = np.dot(self.a,self.b)
        # print(cc)
        # return  int(np.dot(self.a,self.b))

class mango:
    def func(self):
        a=8
        b=9
        return a+b       


class Apple:

    def __init__(self, b):
        
        self.fu =[]
        self.fu.append(20)
        print("orgional", self.fu)
    @staticmethod
    def func2(slelf,x,y):
        temp=mango()
        c=temp.func()
        z=x+y+c    
        self.fu = 20
        return z


    def func3(self,val):
        temp = mango()
        d = temp.func()
        output = d + val
        self.fu = 30
        print("fu", self.fu)
        return output

def separate_array(self,data):
    # Split the data into input and output
    inputs  = [ entry[0] for entry in data ]
    targets = [ entry[1] for entry in data ]
        
    print("inputs",inputs)
    print("targets", targets)

if __name__ == '__main__':

    print "Hello, Python!"

    a = []
    b =[]
    aaa = np.array([[1,2,3,4,5],[6,7,8,9,10]])
    ans = Test(a,b)
    # print(ans.cc)
    mycall = Apple(2)
    mycall.func3(12)
    separate_array(aaa)
    # print(mycall.func2(2,3)) 
    # print(mycall.func3(3) )
    # cc = 2*np.random.random((2,1)) - 1
    # print(cc)


